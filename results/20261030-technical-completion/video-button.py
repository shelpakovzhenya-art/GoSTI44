from pathlib import Path
import shutil,subprocess,hashlib,json
base=Path('/var/www/gosti/releases/20260925-2/.next/standalone');backup=Path('/var/www/gosti/backups/20261030-technical-completion/video-button')
old='1m2h-tech-v2-20261030.css';new='1m2h-tech-v3-20261030.css';f=base/'.next/static/chunks'/old
assert not backup.exists();backup.mkdir()
prefix='html:not('+('#client-letter-20261029'*12)+') '
css=f.read_bytes()+('@layer clientLetter{'+prefix+'.hero-video-toggle{display:block!important;min-height:44px!important;min-width:44px!important}}').encode()
(base/'.next/static/chunks'/new).write_bytes(css)
count=0
for p in (base/'.next/server/app').rglob('page_client-reference-manifest.js'):
 data=p.read_bytes()
 if old.encode()in data:
  dest=backup/p.relative_to(base);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest);p.write_bytes(data.replace(old.encode(),new.encode()));count+=1
assert count==5
subprocess.run(['systemctl','restart','gosti'],check=True)
print(json.dumps({'css':new,'sha':hashlib.sha256(css).hexdigest()}))
