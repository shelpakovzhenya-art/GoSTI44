from pathlib import Path
import json,hashlib,shutil,subprocess
base=Path('/var/www/gosti/releases/20260925-2/.next/standalone')
p=Path(__file__).parent
backup=Path('/var/www/gosti/backups/20261030-remove-guide-closing')
rows=json.loads((p/'targets.json').read_text())
for r in rows:
 f=base/r['path'];assert hashlib.sha256(f.read_bytes()).hexdigest()==r['sha256'];assert f.read_text().count(r['old'])==1
assert not backup.exists();backup.mkdir()
for r in rows:
 f=base/r['path'];dest=backup/r['path'];dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest);f.write_bytes(f.read_bytes().replace(r['old'].encode(),b'null'));subprocess.run(['node','--check',str(f)],check=True)
subprocess.run(['systemctl','restart','gosti'],check=True)
print('Patched two SSR components')
