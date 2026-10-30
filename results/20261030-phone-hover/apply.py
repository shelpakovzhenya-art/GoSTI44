from pathlib import Path
import hashlib,shutil,subprocess
b=Path('/var/www/gosti/releases/20260925-2/.next/standalone');c=Path('/etc/nginx/sites-available/gosti');backup=Path('/var/www/gosti/backups/20261030-phone-hover')
assert hashlib.sha256(c.read_bytes()).hexdigest()=='b4ca0dd18a04848ab86eb68c4f3ebf5929b84eb69226c9deb93cd977195cb357'
assert not backup.exists();backup.mkdir();shutil.copy2(c,backup/'nginx.conf')
pre='html'+':not(#client-letter-20261029)'*12+' .contact-actions > .button.button-dark'
css='\n@layer clientLetter{'+pre+','+pre+':hover,'+pre+':focus-visible,'+pre+':active{transform:none!important;overflow:visible!important;clip-path:none!important}'+pre+'::before{display:none!important;content:none!important}'+pre+' svg,'+pre+':hover svg,'+pre+':focus-visible svg,'+pre+':active svg{transform:none!important;translate:none!important;rotate:none!important}'+pre+':hover svg{filter:brightness(.96)}}'
pairs=[('1m2h-contact-row-v3-20261030.css','1m2h-phone-hover-20261030.css'),('home-only-contact-row-v3-20261030.css','home-only-phone-hover-20261030.css')]
for old,new in pairs:
 f=b/'.next/static/chunks'/old;shutil.copy2(f,backup/old);(b/'.next/static/chunks'/new).write_bytes(f.read_bytes()+css.encode())
for f in (b/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes()
 if pairs[0][0].encode()in raw:
  dest=backup/f.relative_to(b);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
  f.write_bytes(raw.replace(pairs[0][0].encode(),pairs[0][1].encode()))
s=c.read_text()
for old,new in pairs:s=s.replace(old,new)
c.write_text(s);subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
print('Phone hover fixed')
