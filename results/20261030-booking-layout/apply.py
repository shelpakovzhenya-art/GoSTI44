from pathlib import Path
import hashlib,shutil,subprocess
b=Path('/var/www/gosti/releases/20260925-2/.next/standalone');p=Path(__file__).parent;bk=Path('/var/www/gosti/backups/20261030-booking-layout');old='1m2h-booking-native-20261030.css';new='1m2h-booking-layout-v2-20261030.css';f=b/'.next/static/chunks'/old
assert hashlib.sha256(f.read_bytes()).hexdigest()=='372feef642eb2f1c5ceb3065f23d30d939f81c65fca5a7d3706f849253a71885';assert not bk.exists();bk.mkdir();(b/'.next/static/chunks'/new).write_bytes(f.read_bytes()+(p/'patch.css').read_bytes())
for f in (b/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes()
 if old.encode()in raw:
  d=bk/f.relative_to(b);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(raw.replace(old.encode(),new.encode()))
f=Path('/etc/nginx/sites-available/gosti');assert old.encode()in f.read_bytes();shutil.copy2(f,bk/'nginx.conf');f.write_bytes(f.read_bytes().replace(old.encode(),new.encode()));subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
