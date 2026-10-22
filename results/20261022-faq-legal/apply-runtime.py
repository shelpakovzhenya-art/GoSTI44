from pathlib import Path,PurePosixPath
import os,json,hashlib,shutil,sqlite3,pwd,grp,urllib.request
stage=Path(__file__).resolve().parent;plan=json.loads((stage/'plan.json').read_text());base=Path(plan['productionRoot']);assert Path('/var/www/gosti/current/.next/standalone').resolve()==base
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def tree(root):
 rows=[]
 for directory,dirs,files in os.walk(root,followlinks=False):
  for name in dirs+files:
   p=Path(directory)/name;rel=p.relative_to(root).as_posix()
   if p.is_symlink():rows.append({'path':rel,'type':'link','target':os.readlink(p)})
   elif p.is_file():rows.append({'path':rel,'type':'file','bytes':p.stat().st_size,'sha256':sha(p)})
 rows.sort(key=lambda r:r['path']);return hashlib.sha256(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
assert tree(base)==plan['runtimeBefore']['treeSha256'],'Production tree changed'
assert hashlib.sha256(urllib.request.urlopen('https://tangerin.ru/api/content',timeout=30).read()).hexdigest()==plan['publishedAPI']
for item in plan['guards']:assert sha(base/item['path'])==item['sha256']
for item in plan['additions']+plan['replacements']:
 rel=PurePosixPath(item['path']);assert not rel.is_absolute()and'..'not in rel.parts;assert sha(stage/'payload'/rel)==item.get('afterSha256',item.get('sha256'))
 if 'beforeSha256'in item:assert sha(base/rel)==item['beforeSha256']
 else:assert not(base/rel).exists()
backup=Path(plan['backup']);backup.mkdir(mode=0o700,exist_ok=False)
with sqlite3.connect('file:/var/www/gosti/shared/database.sqlite?mode=ro',uri=True)as source:
 with sqlite3.connect(backup/'database.sqlite')as target:source.backup(target);assert target.execute('pragma integrity_check').fetchone()[0]=='ok'
(backup/'database.sqlite').chmod(0o600)
for name in ['plan.json','content-patch.json','apply-content.php','apply-runtime.py','verify-server.py']:shutil.copy2(stage/name,backup/name);(backup/name).chmod(0o600)
for item in plan['replacements']:
 dst=backup/item['path'];dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(base/item['path'],dst)
uid,gid=pwd.getpwnam('gosti').pw_uid,grp.getgrnam('www-data').gr_gid
for item in plan['additions']+plan['replacements']:
 dst=base/item['path'];tmp=dst.with_name(dst.name+'.faq-legal-tmp');shutil.copy2(stage/'payload'/item['path'],tmp);os.chmod(tmp,0o644);os.chown(tmp,uid,gid);os.replace(tmp,dst)
assert tree(base)==plan['runtimeAfter']['treeSha256']
print(json.dumps({'runtimeFilesChanged':len(plan['additions'])+len(plan['replacements']),'backup':str(backup),'databaseIntegrity':'ok'}))
