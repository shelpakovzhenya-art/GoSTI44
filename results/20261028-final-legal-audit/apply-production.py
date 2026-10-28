from pathlib import Path,PurePosixPath
import copy,datetime,grp,hashlib,json,os,pwd,shutil,sqlite3,urllib.request
stage=Path(__file__).resolve().parent;plan=json.loads((stage/'plan.json').read_text());spec=json.loads((stage/'content-patch.json').read_text());base=Path(plan['productionRoot']);backup=Path(plan['backup']);sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def tree(root):
 rows=[]
 for directory,dirs,files in os.walk(root,followlinks=False):
  for name in dirs+files:
   f=Path(directory)/name;rel=f.relative_to(root).as_posix()
   if f.is_symlink():rows.append({'path':rel,'type':'link','target':os.readlink(f)})
   elif f.is_file():rows.append({'path':rel,'type':'file','bytes':f.stat().st_size,'sha256':sha(f)})
 rows.sort(key=lambda r:r['path']);return hashlib.sha256(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
assert Path('/var/www/gosti/current/.next/standalone').resolve()==base
assert tree(base)==plan['runtimeBefore']['treeSha256'],'Production runtime changed'
assert hashlib.sha256(urllib.request.urlopen('https://tangerin.ru/api/content').read()).hexdigest()==plan['publishedAPI'],'Content changed'
for x in plan['guards']:assert sha(base/x['path'])==x['sha256']
for x in plan['additions']+plan['replacements']:
 rel=PurePosixPath(x['path']);assert not rel.is_absolute()and'..'not in rel.parts
 assert sha(stage/'payload'/rel)==x.get('afterSha256',x.get('sha256'))
 if 'beforeSha256'in x:assert sha(base/rel)==x['beforeSha256']
 else:assert not(base/rel).exists()
os.umask(0o077);backup.mkdir(mode=0o700,exist_ok=False)
c=sqlite3.connect('/var/www/gosti/shared/database.sqlite');c.row_factory=sqlite3.Row
with sqlite3.connect(backup/'database.sqlite')as b:c.backup(b);assert b.execute('pragma integrity_check').fetchone()[0]=='ok'
for f in ['plan.json','content-patch.json','apply-production.py']:shutil.copy2(stage/f,backup/f)
for x in plan['replacements']:
 d=backup/x['path'];d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(base/x['path'],d)
uid,gid=pwd.getpwnam('gosti').pw_uid,grp.getgrnam('www-data').gr_gid
c.execute('BEGIN IMMEDIATE');applied=False
try:
 before={r['key']:dict(r)for r in c.execute('select * from content_entries')};expected=copy.deepcopy(before);rev=c.execute('select count(*)from content_revisions').fetchone()[0];now=datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
 for e in spec['edits']:
  row=before[e['key']];assert row['kind']==e['kind']
  for field in ['draft','published']:assert json.loads(row[field])==e['before'],(e['key'],field,'changed')
  value=json.dumps(e['after'],ensure_ascii=False,separators=(',',':'))
  c.execute('update content_entries set draft=?,published=?,updated_at=?,published_at=?where id=?',(value,value,now,now,row['id']));expected[e['key']].update(draft=value,published=value,updated_at=now,published_at=now)
  for action in ['draft','publish']:c.execute('insert into content_revisions(content_entry_id,user_id,action,data,created_at,updated_at)values(?,NULL,?,?,?,?)',(row['id'],action,value,now,now))
 assert {r['key']:dict(r)for r in c.execute('select *from content_entries')}==expected
 for e in spec['creates']:
  assert e['key']not in before;value=json.dumps(e['data'],ensure_ascii=False,separators=(',',':'))
  cursor=c.execute('insert into content_entries(kind,key,name,draft,published,published_at,position,created_at,updated_at)values(?,?,?,?,?,?,?,?,?)',(e['kind'],e['key'],e['name'],value,value,now,e.get('position',1100),now,now))
  for action in ['draft','publish']:c.execute('insert into content_revisions(content_entry_id,user_id,action,data,created_at,updated_at)values(?,NULL,?,?,?,?)',(cursor.lastrowid,action,value,now,now))
 revisions=2*(len(spec['edits'])+len(spec['creates']));assert c.execute('select count(*)from content_revisions').fetchone()[0]==rev+revisions
 assert c.execute('pragma integrity_check').fetchone()[0]=='ok'
 for x in plan['additions']+plan['replacements']:
  d=base/x['path']
  for parent in reversed(d.parent.parents):
   if parent==base or base in parent.parents:
    if not parent.exists():parent.mkdir();os.chmod(parent,0o755);os.chown(parent,uid,gid)
  if not d.parent.exists():d.parent.mkdir();os.chmod(d.parent,0o755);os.chown(d.parent,uid,gid)
  tmp=d.with_name(d.name+'.legal-tmp');shutil.copy2(stage/'payload'/x['path'],tmp);os.chmod(tmp,0o644);os.chown(tmp,uid,gid);os.replace(tmp,d)
 assert tree(base)==plan['runtimeAfter']['treeSha256'];c.commit();applied=True
except BaseException:
 c.rollback()
 for x in plan['replacements']:shutil.copy2(backup/x['path'],base/x['path'])
 for x in plan['additions']:(base/x['path']).unlink(missing_ok=True)
 raise
result={'changedEntries':[e['key']for e in spec['edits']],'createdEntries':[e['key']for e in spec['creates']],'unchangedRows':len(before)-len(spec['edits']),'revisionsAdded':revisions,'databaseIntegrity':'ok','runtimeFilesChanged':len(plan['additions'])+len(plan['replacements']),'runtime':plan['runtimeAfter'],'backup':str(backup)}
(backup/'verification.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
