from pathlib import Path
import json,hashlib,shutil,subprocess
b=Path('/var/www/gosti/releases/20260925-2/.next/standalone');p=Path(__file__).parent;bk=Path('/var/www/gosti/backups/20261030-booking-native');assert not bk.exists()
for n,h in json.loads((p/'guards.json').read_text()).items():assert hashlib.sha256((b/'.next/static/chunks'/n).read_bytes()).hexdigest()==h
bk.mkdir();oldjs='3cltmr-tech-v2-20261030.js';newjs='3cltmr-booking-native-v2-20261030.js';oldcss='1m2h-guide-cards-compact-20261030.css';newcss='1m2h-booking-native-20261030.css'
s=(b/'.next/static/chunks'/oldjs).read_text();start=s.index('/* Own loading/recovery;');end=s.index('  let watched',start);assert s[start:end].rstrip().endswith('})();');s=s[:start]+(p/'manager.js').read_text()+'\n'+s[end:]
s=s.replace('if (home !== wasHome) { wasHome = home; footerController?.resume(); }','wasHome = home; footerController?.resume();')
f=b/'.next/static/chunks'/newjs;f.write_bytes(s.encode());subprocess.run(['node','--check',str(f)],check=True)
(b/'.next/static/chunks'/newcss).write_bytes((b/'.next/static/chunks'/oldcss).read_bytes()+(p/'form.css').read_bytes())
for f in (b/'.next/server').rglob('*.js'):
 raw=f.read_bytes();changed=raw.replace(oldjs.encode(),newjs.encode()).replace(oldcss.encode(),newcss.encode())
 if changed!=raw:
  d=bk/f.relative_to(b);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(changed)
f=Path('/etc/nginx/sites-available/gosti');shutil.copy2(f,bk/'nginx.conf');f.write_bytes(f.read_bytes().replace(oldcss.encode(),newcss.encode()))
subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
