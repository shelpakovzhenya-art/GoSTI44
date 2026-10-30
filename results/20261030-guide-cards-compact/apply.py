from pathlib import Path
import hashlib,json,shutil,subprocess
b=Path('/var/www/gosti/releases/20260925-2/.next/standalone');p=Path(__file__).parent;bk=Path('/var/www/gosti/backups/20261030-guide-cards-compact');assert not bk.exists()
rows=json.loads((p/'targets.json').read_text())
oldexpr='l!=="Сверьте выходные и сеансы"&&';newexpr='l!=="Сверьте выходные и сеансы"&&l!=="Покупайте с расчётом на дорогу"&&'
for r in rows:
 f=b/r['path'];assert hashlib.sha256(f.read_bytes()).hexdigest()==r['sha'];assert f.read_text().count(oldexpr)==1
bk.mkdir()
for r in rows:
 f=b/r['path'];d=bk/r['path'];d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(f.read_bytes().replace(oldexpr.encode(),newexpr.encode()));subprocess.run(['node','--check',str(f)],check=True)
old='1m2h-guide-hero-compact-20261030.css';new='1m2h-guide-cards-compact-20261030.css'
(b/'.next/static/chunks'/new).write_bytes((b/'.next/static/chunks'/old).read_bytes()+(p/'patch.css').read_bytes())
for f in (b/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes()
 if old.encode()in raw:
  d=bk/f.relative_to(b);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(raw.replace(old.encode(),new.encode()))
f=Path('/etc/nginx/sites-available/gosti');assert old.encode()in f.read_bytes();shutil.copy2(f,bk/'nginx.conf');f.write_bytes(f.read_bytes().replace(old.encode(),new.encode()))
subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
