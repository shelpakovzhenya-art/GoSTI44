from pathlib import Path
import hashlib,shutil,subprocess
b=Path('/var/www/gosti/releases/20260925-2/.next/standalone');c=Path('/etc/nginx/sites-available/gosti');backup=Path('/var/www/gosti/backups/20261030-feature-icon-gap')
assert hashlib.sha256(c.read_bytes()).hexdigest()=='d5a4d062101c892818d7b614b05f0a87b93c91a2e3697c8355be1e33d5dc2c0c'
assert not backup.exists();backup.mkdir();shutil.copy2(c,backup/'nginx.conf')
pre='html'+':not(#client-letter-20261029)'*12+' body:has(#business-contact) '
css='\n@layer clientLetter{'+pre+'.rs-feature{grid-template-columns:36px minmax(0,1fr)!important;column-gap:14px!important}'+pre+'.rs-feature .rs-icon-disc{box-sizing:border-box!important;width:36px!important;height:36px!important;min-width:0!important;min-height:0!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important}'+pre+'.rs-feature h3{padding:0!important;min-width:0!important}}'
old='1m2h-business-features-20261030.css';new='1m2h-feature-icon-gap-20261030.css';f=b/'.next/static/chunks'/old;shutil.copy2(f,backup/old);(b/'.next/static/chunks'/new).write_bytes(f.read_bytes()+css.encode())
for f in (b/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes()
 if old.encode()in raw:
  d=backup/f.relative_to(b);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(raw.replace(old.encode(),new.encode()))
c.write_text(c.read_text().replace(old,new));subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
