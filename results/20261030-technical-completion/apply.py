from pathlib import Path
import json,hashlib,shutil,subprocess,urllib.request
p=Path('/var/www/gosti/staging/20261030-technical-completion');base=Path('/var/www/gosti/releases/20260925-2/.next/standalone');backup=Path('/var/www/gosti/backups/20261030-technical-completion')
spec=json.loads((p/'patch.json').read_text());sha=lambda b:hashlib.sha256(b).hexdigest()
assert not backup.exists()
for item in spec:
 f=base/item['path'];src=p/'payload'/item['path'];assert sha(src.read_bytes())==item['sha256']
 if item['before']:assert f.is_file()and sha(f.read_bytes())==item['before'],item['path']
 else:assert not f.exists(),item['path']
api=sha(urllib.request.urlopen('https://tangerin.ru/api/content').read())
assert api=='8398d87142f028cdc9d58eea2d093500c9322345d2c2395a7b21f7db05c83597'
conf=Path('/etc/nginx/sites-available/gosti');original=conf.read_bytes()
assert sha(original)=='67e7d77f7c97d011793b9151d9e49d133c361f075332585f6c31ada3d5aa5318'
backup.mkdir();(backup/'nginx.conf').write_bytes(original)
for item in spec:
 if item['before']:
  dst=backup/item['path'];dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(base/item['path'],dst)
for item in spec:
 dst=base/item['path'];dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p/'payload'/item['path'],dst)
new=original.replace(b'listen 443 ssl;',b'listen 443 ssl http2;').replace(b'listen [::]:443 ssl;',b'listen [::]:443 ssl http2;')
conf.write_bytes(new)
r=subprocess.run(['nginx','-t'],capture_output=True,text=True)
if r.returncode:
 conf.write_bytes(original)
 raise RuntimeError(r.stderr)
subprocess.run(['systemctl','reload','nginx'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True)
print(json.dumps({'files':len(spec),'cmsUnchanged':True,'backup':str(backup),'http2':True,'nginxSHA':sha(new)}))

