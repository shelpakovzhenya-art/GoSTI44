from pathlib import Path
import hashlib,shutil,subprocess,json
base=Path('/var/www/gosti/releases/20260925-2/.next/standalone');backup=Path('/var/www/gosti/backups/20261030-contact-row');assert not backup.exists()
conf=Path('/etc/nginx/sites-available/gosti');assert hashlib.sha256(conf.read_bytes()).hexdigest()=='42b4371c1b74d39aa04e09c418e7da6907a9fc7bbe75abd8a007543b297d3b17'
backup.mkdir();shutil.copy2(conf,backup/'nginx.conf')
prefix='html'+':not(#client-letter-20261029)'*12+' .contact-actions > .button.button-dark'
css='\n@layer clientLetter{'+prefix+'{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;width:54px!important;min-width:54px!important;height:76.5px!important;min-height:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;gap:8px!important;font-size:0!important;line-height:0!important}'+prefix+' svg{display:block!important;width:54px!important;height:54px!important;min-height:54px!important;flex-shrink:0!important;padding:17px!important;box-sizing:border-box!important;background:#ff9d29!important;border:1px solid #ed840c!important;border-radius:50%!important;color:#183f32!important}'+prefix+'::after{content:"Позвонить"!important;display:block!important;font-size:10px!important;line-height:14.5px!important;font-weight:400!important;color:#514b40!important;position:static!important;transform:none!important}}'
pairs=[('1m2h-tech-v4-20261030.css','1m2h-contact-row-20261030.css'),('home-only-20261030.css','home-only-contact-row-20261030.css')]
for old,new in pairs:
 f=base/'.next/static/chunks'/old;shutil.copy2(f,backup/old);(base/'.next/static/chunks'/new).write_bytes(f.read_bytes()+css.encode())
for f in (base/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes()
 if b'1m2h-tech-v4-20261030.css'in raw:
  d=backup/f.relative_to(base);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(raw.replace(b'1m2h-tech-v4-20261030.css',b'1m2h-contact-row-20261030.css'))
s=conf.read_text()
for old,new in pairs:s=s.replace(old,new)
conf.write_text(s);subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
print('Contact controls aligned')
