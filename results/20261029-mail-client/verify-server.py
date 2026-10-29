from pathlib import Path
import os, json, hashlib, sqlite3, urllib.request, subprocess

stage = Path(__file__).resolve().parent
plan = json.loads((stage / 'plan.json').read_text())
backup, base = Path(plan['backup']), Path(plan['productionRoot'])
old = sqlite3.connect('file:' + str(backup / 'database.sqlite') + '?mode=ro', uri=True)
new = sqlite3.connect('file:/var/www/gosti/shared/database.sqlite?mode=ro', uri=True)
old.row_factory = new.row_factory = sqlite3.Row
a = {r['key']: dict(r) for r in old.execute('select * from content_entries')}
b = {r['key']: dict(r) for r in new.execute('select * from content_entries')}
spec=json.loads((stage/'content-patch.json').read_text())
changed={e['key']:e for e in spec['edits']}
assert a.keys()==b.keys()
for key in a:
    if key not in changed:
        assert a[key]==b[key],key
        continue
    for field in ['published','draft']:
        expected=json.loads(a[key][field])
        for change in changed[key]['changes']:
            current=expected
            for part in change['path'][:-1]:current=current[part]
            assert current[change['path'][-1]]==change['before']
            current[change['path'][-1]]=change['after']
        assert expected==json.loads(b[key][field]),(key,field)

rev = new.execute('select count(*) from content_revisions').fetchone()[0] - old.execute('select count(*) from content_revisions').fetchone()[0]
assert rev == len(changed)*2
assert new.execute('pragma integrity_check').fetchone()[0] == 'ok'
rows = []
for directory, dirs, files in os.walk(base, followlinks=False):
    for name in dirs + files:
        p = Path(directory) / name
        rel = p.relative_to(base).as_posix()
        if p.is_symlink():
            rows.append({'path': rel, 'type': 'link', 'target': os.readlink(p)})
        elif p.is_file():
            rows.append({'path': rel, 'type': 'file', 'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()})
rows.sort(key=lambda r: r['path'])
digest = hashlib.sha256(json.dumps(rows, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
assert digest == plan['runtimeAfter']['treeSha256']
api = hashlib.sha256(urllib.request.urlopen('https://tangerin.ru/api/content', timeout=30).read()).hexdigest()
actual=json.loads(urllib.request.urlopen('https://tangerin.ru/api/content').read())
expected=json.loads((stage/'after.json').read_text())
normalize=lambda doc:{e['key']:{'kind':e['kind'],'data':e['data']}for e in doc['entries']}
assert actual['version']==expected['version'] and normalize(actual)==normalize(expected)
assert subprocess.check_output(['systemctl', 'is-active', 'gosti'], text=True).strip() == 'active'
result = {'runtime': plan['runtimeAfter'], 'CMSRows': len(b), 'unchangedCMSRows': len(b)-len(changed), 'changedCMSRows':len(changed), 'unrelatedDraftFieldsPreserved':True, 'revisionsAdded': rev, 'publishedApiSha256': api, 'databaseIntegrity': 'ok', 'gosti': 'active'}
(backup / 'verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
print(json.dumps(result, ensure_ascii=False))
