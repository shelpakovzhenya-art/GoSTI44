from pathlib import Path
import hashlib,json,shutil,subprocess,urllib.request
base=Path('/var/www/gosti/releases/20260925-2/.next/standalone')
backup=Path('/var/www/gosti/backups/20261030-bath-heading')
old='1m2h-client-letter-v7-20261029.css';new='1m2h-client-letter-v8-20261030.css'
files=list(base.glob('.next/static/chunks/'+old))
assert len(files)==1
css=files[0];content=css.read_text()
assert '@layer clientLetter;' in content
manifests=[p for p in base.glob('.next/server/app/**/page_client-reference-manifest.js') if old in p.read_text()]
assert len(manifests)==5
assert not backup.exists()
backup.mkdir()
for p in [css]+manifests:
 target=backup/p.relative_to(base);target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target)
prefix='html:not('+('#client-letter-20261029'*12)+')'
extra='\n@layer clientLetter {'+prefix+' .client-bath-heading h1{font-size:56px!important;line-height:1.08!important}@media(max-width:767px){'+prefix+' .client-bath-heading h1{font-size:40px!important}}}\n'
(css.parent/new).write_text(content+extra)
for p in manifests:p.write_text(p.read_text().replace(old,new))
subprocess.run(['systemctl','restart','gosti'],check=True)
print(json.dumps({'css':new,'manifests':len(manifests),'backup':str(backup),'sha256':hashlib.sha256((css.parent/new).read_bytes()).hexdigest()}))

