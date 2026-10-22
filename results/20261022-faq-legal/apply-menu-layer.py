from pathlib import Path
import os,json,hashlib,shutil,pwd,grp,urllib.request
stage=Path(__file__).resolve().parent
first=json.loads((stage/'initial-plan.json').read_text());final=json.loads((stage/'plan.json').read_text());base=Path(final['productionRoot']);backup=Path(final['backup'])
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
rows=[]
for directory,dirs,files in os.walk(base,followlinks=False):
 for name in dirs+files:
  p=Path(directory)/name;rel=p.relative_to(base).as_posix()
  if p.is_symlink():rows.append({'path':rel,'type':'link','target':os.readlink(p)})
  elif p.is_file():rows.append({'path':rel,'type':'file','bytes':p.stat().st_size,'sha256':sha(p)})
rows.sort(key=lambda r:r['path']);digest=hashlib.sha256(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
assert digest==first['runtimeAfter']['treeSha256']
assert hashlib.sha256(urllib.request.urlopen('https://tangerin.ru/api/content',timeout=30).read()).hexdigest()==(stage/'current-api-sha.txt').read_text().strip()
old_replacements={i['path']:i for i in first['replacements']};old_additions={i['path']for i in first['additions']}
additions=[i for i in final['additions']if i['path']not in old_additions]
replacements=[i for i in final['replacements']if i['afterSha256']!=old_replacements[i['path']]['afterSha256']]
assert len(additions)==1 and len(replacements)==5
for item in additions+replacements:
 assert sha(stage/'payload'/item['path'])==item.get('afterSha256',item.get('sha256'))
 if item in replacements:assert sha(base/item['path'])==old_replacements[item['path']]['afterSha256']
 else:assert not(base/item['path']).exists()
assert not(backup/'initial-plan.json').exists()
shutil.copyfile(backup/'plan.json',backup/'initial-plan.json');os.chmod(backup/'initial-plan.json',0o600)
shutil.copyfile(stage/'plan.json',backup/'plan.json');os.chmod(backup/'plan.json',0o600)
if(backup/'verification.json').exists():shutil.copyfile(backup/'verification.json',backup/'initial-verification.json')
for item in replacements:
 dst=backup/'menu-layer-before'/item['path'];dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(base/item['path'],dst)
uid,gid=pwd.getpwnam('gosti').pw_uid,grp.getgrnam('www-data').gr_gid
for item in additions+replacements:
 dst=base/item['path'];temp=dst.with_name(dst.name+'.faq-layer-tmp');shutil.copyfile(stage/'payload'/item['path'],temp);os.chmod(temp,0o644);os.chown(temp,uid,gid);os.replace(temp,dst)
print(json.dumps({'menuLayerFixed':True,'followupRuntimeWrites':6,'CMSChanges':0}))
