from pathlib import Path
import os,json,hashlib,sqlite3

stage=Path(__file__).resolve().parent
plan=json.loads((stage/'plan.json').read_text())
spec=json.loads((stage/'content-patch.json').read_text())
backup=Path(plan['backup']);base=Path(plan['productionRoot'])
edits={e['key']:e for e in spec['edits']}
old=sqlite3.connect('file:'+str(backup/'database.sqlite')+'?mode=ro',uri=True)
new=sqlite3.connect('file:/var/www/gosti/shared/database.sqlite?mode=ro',uri=True)
old.row_factory=new.row_factory=sqlite3.Row
a={r['key']:dict(r)for r in old.execute('select * from content_entries')}
b={r['key']:dict(r)for r in new.execute('select * from content_entries')}
assert a.keys()==b.keys()
changed=[]
for key,row in a.items():
 fresh=b[key]
 if key not in edits:
  assert row==fresh
  continue
 changed.append(key)
 for field in ['published','draft']:
  expected=json.loads(row[field]);actual=json.loads(fresh[field])
  for change in edits[key]['transforms']:
   assert expected['body'].count(change['before'])==1
   expected['body']=expected['body'].replace(change['before'],change['after'])
  for change in edits[key]['textTransforms']:
   targets=[t for t in expected['texts']if t['key']==change['key']]
   assert len(targets)==1 and targets[0]['value']==change['before']
   targets[0]['value']=change['after']
  assert expected==actual
 ignored=['published','draft','updated_at','published_at']
 assert {k:v for k,v in row.items()if k not in ignored}=={k:v for k,v in fresh.items()if k not in ignored}
rev=new.execute('select count(*) from content_revisions').fetchone()[0]-old.execute('select count(*) from content_revisions').fetchone()[0]
assert rev==4
assert new.execute('pragma integrity_check').fetchone()[0]=='ok'
rows=[]
for directory,dirs,files in os.walk(base,followlinks=False):
 for name in dirs+files:
  p=Path(directory)/name;rel=p.relative_to(base).as_posix()
  if p.is_symlink():rows.append({'path':rel,'type':'link','target':os.readlink(p)})
  elif p.is_file():rows.append({'path':rel,'type':'file','bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
rows.sort(key=lambda r:r['path'])
digest=hashlib.sha256(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
assert digest==plan['runtimeAfter']['treeSha256']
result={'runtime':plan['runtimeAfter'],'CMSRows':len(b),'changedEntries':changed,'other57RowsUnchanged':True,'onlyTargetFieldsInPublishedAndDraft':True,'draftFieldsPreserved':True,'revisionsAdded':rev,'databaseIntegrity':'ok'}
(backup/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False))
