from pathlib import Path
import shutil,subprocess
b=Path('/var/www/gosti/releases/20260925-2/.next/standalone');bk=Path('/var/www/gosti/backups/20261030-contact-phone-size');assert not bk.exists();bk.mkdir()
pairs={'1m2h-booking-layout-v2-20261030.css':'1m2h-contact-phone-20261030.css','home-only-phone-hover-20261030.css':'home-only-contact-phone-20261030.css'}
css='\n@layer clientLetter{html'+':not(#client-letter-20261029)'*32+' .contact-phone{font-size:20px!important;line-height:1.4!important;font-weight:600!important;letter-spacing:normal!important;}}'
for old,new in pairs.items():
 f=b/'.next/static/chunks'/old;assert f.exists();(b/'.next/static/chunks'/new).write_bytes(f.read_bytes()+css.encode())
for f in (b/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes();updated=raw
 for old,new in pairs.items():updated=updated.replace(old.encode(),new.encode())
 if raw!=updated:
  d=bk/f.relative_to(b);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(updated)
f=Path('/etc/nginx/sites-available/gosti');shutil.copy2(f,bk/'nginx.conf');raw=f.read_bytes()
for old,new in pairs.items():raw=raw.replace(old.encode(),new.encode())
f.write_bytes(raw);subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
