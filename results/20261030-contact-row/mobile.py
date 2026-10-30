from pathlib import Path
import shutil,subprocess
base=Path('/var/www/gosti/releases/20260925-2/.next/standalone');conf=Path('/etc/nginx/sites-available/gosti')
pre='html'+':not(#client-letter-20261029)'*12
css='\n@layer clientLetter{'+pre+' .contact-actions{flex-direction:row!important;flex-wrap:nowrap!important;align-items:flex-start!important;gap:8px!important}'+pre+' .contact-actions .contact-links{flex-wrap:nowrap!important;gap:8px!important;width:auto!important}@media(max-width:359px){'+pre+' .contact-actions{gap:6px!important}'+pre+' .contact-actions .contact-links{gap:6px!important}'+pre+' .contact-actions > .button.button-dark{width:44px!important;min-width:44px!important;height:66.5px!important}'+pre+' .contact-actions > .button.button-dark svg{width:44px!important;height:44px!important;min-height:44px!important;padding:12px!important}'+pre+' .contact-actions .social-link{width:44px!important;min-width:44px!important}'+pre+' .contact-actions .social-icon{width:44px!important;height:44px!important;min-width:44px!important}}}'
pairs=[('1m2h-contact-row-20261030.css','1m2h-contact-row-v2-20261030.css'),('home-only-contact-row-20261030.css','home-only-contact-row-v2-20261030.css')]
for old,new in pairs:(base/'.next/static/chunks'/new).write_bytes((base/'.next/static/chunks'/old).read_bytes()+css.encode())
for f in (base/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes();f.write_bytes(raw.replace(pairs[0][0].encode(),pairs[0][1].encode()))
s=conf.read_text()
for old,new in pairs:s=s.replace(old,new)
conf.write_text(s);subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
