from pathlib import Path
import json,hashlib,shutil,subprocess
p=Path('/var/www/gosti/staging/20261030-technical-completion');base=Path('/var/www/gosti/releases/20260925-2/.next/standalone');backup=Path('/var/www/gosti/backups/20261030-technical-completion/followup')
spec=json.loads((p/'followup.json').read_text());sha=lambda b:hashlib.sha256(b).hexdigest()
assert not backup.exists()
for x in spec:
 assert sha((p/'followup'/x['path']).read_bytes())==x['sha256']
 f=base/x['path']
 if x['before']:assert sha(f.read_bytes())==x['before'],x['path']
 else:assert not f.exists()
backup.mkdir()
for x in spec:
 f=base/x['path']
 if x['before']:
  d=backup/x['path'];d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d)
 shutil.copy2(p/'followup'/x['path'],f)
subprocess.run(['systemctl','restart','gosti'],check=True)
print('followup applied: '+str(len(spec)))
