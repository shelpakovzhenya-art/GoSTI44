from pathlib import Path, PurePosixPath
import copy, datetime, grp, hashlib, json, os, pwd, shutil, sqlite3, urllib.request

stage = Path(__file__).resolve().parent
plan = json.loads((stage/'plan.json').read_text())
spec = json.loads((stage/'content-patch.json').read_text())
base, backup = Path(plan['productionRoot']), Path(plan['backup'])
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
def tree(root):
    rows = []
    for directory, dirs, files in os.walk(root, followlinks=False):
        for name in dirs+files:
            p = Path(directory)/name
            rel = p.relative_to(root).as_posix()
            if p.is_symlink(): rows.append({'path':rel,'type':'link','target':os.readlink(p)})
            elif p.is_file(): rows.append({'path':rel,'type':'file','bytes':p.stat().st_size,'sha256':sha(p)})
    rows.sort(key=lambda r:r['path'])
    return hashlib.sha256(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
assert Path('/var/www/gosti/current/.next/standalone').resolve()==base
assert tree(base)==plan['runtimeBefore']['treeSha256'], 'Production tree changed'
assert hashlib.sha256(urllib.request.urlopen('https://tangerin.ru/api/content').read()).hexdigest()==plan['publishedAPI']
for item in plan['guards']: assert sha(base/item['path'])==item['sha256']
for item in plan['additions']+plan['replacements']:
    rel=PurePosixPath(item['path'])
    assert not rel.is_absolute() and '..' not in rel.parts
    assert sha(stage/'payload'/rel)==item.get('afterSha256',item.get('sha256'))
    if 'beforeSha256' in item: assert sha(base/rel)==item['beforeSha256']
    else: assert not (base/rel).exists()
os.umask(0o077)
backup.mkdir(mode=0o700,exist_ok=False)
c=sqlite3.connect('/var/www/gosti/shared/database.sqlite');c.row_factory=sqlite3.Row
with sqlite3.connect(backup/'database.sqlite') as b:
    c.backup(b)
    assert b.execute('pragma integrity_check').fetchone()[0]=='ok'
for name in ['plan.json','content-patch.json','apply-production.py']:
    shutil.copy2(stage/name,backup/name)
    (backup/name).chmod(0o600)
for item in plan['replacements']:
    dest=backup/item['path'];dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(base/item['path'],dest)
uid,gid=pwd.getpwnam('gosti').pw_uid,grp.getgrnam('www-data').gr_gid
c.execute('BEGIN IMMEDIATE')
try:
    before={r['key']:dict(r) for r in c.execute('select * from content_entries')}
    expected=copy.deepcopy(before)
    revision_count=c.execute('select count(*) from content_revisions').fetchone()[0]
    now=datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
    for edit in spec['edits']:
        row=before[edit['key']]
        assert row['kind']==edit['kind'] and json.loads(row['published'])==edit['beforePublished']
        fields={}
        for field in ['published','draft']:
            data=json.loads(row[field])
            for change in edit['transforms']:
                assert data['body'].count(change['before'])==1
                data['body']=data['body'].replace(change['before'],change['after'])
            fields[field]=json.dumps(data,ensure_ascii=False,separators=(',',':'))
        c.execute('update content_entries set published=?,draft=?,updated_at=?,published_at=? where id=?',
                  (fields['published'],fields['draft'],now,now,row['id']))
        expected[edit['key']].update(fields,updated_at=now,published_at=now)
        for field,action in [('published','publish'),('draft','draft')]:
            c.execute('insert into content_revisions(content_entry_id,user_id,action,data,created_at,updated_at) values (?,NULL,?,?,?,?)',
                      (row['id'],action,fields[field],now,now))
    assert {r['key']:dict(r) for r in c.execute('select * from content_entries')}==expected
    assert c.execute('select count(*) from content_revisions').fetchone()[0]==revision_count
    assert c.execute('pragma integrity_check').fetchone()[0]=='ok'
    for item in plan['additions']+plan['replacements']:
        dest=base/item['path'];temp=dest.with_name(dest.name+'.house-cards-tmp')
        shutil.copy2(stage/'payload'/item['path'],temp)
        os.chmod(temp,0o644);os.chown(temp,uid,gid);os.replace(temp,dest)
    assert tree(base)==plan['runtimeAfter']['treeSha256']
    c.commit()
except BaseException:
    c.rollback()
    for item in plan['replacements']:shutil.copy2(backup/item['path'],base/item['path'])
    for item in plan['additions']:(base/item['path']).unlink(missing_ok=True)
    raise
result={'changedEntries':[e['key'] for e in spec['edits']],'otherRowsUnchanged':len(before),
        'otherDraftFieldsPreserved':True,'revisionsAdded':0,'databaseIntegrity':'ok','runtimeFilesChanged':6,
        'runtime':plan['runtimeAfter'],'backup':str(backup)}
(backup/'verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
