from pathlib import Path
import hashlib,shutil,subprocess
b=Path('/var/www/gosti/releases/20260925-2/.next/standalone');c=Path('/etc/nginx/sites-available/gosti');backup=Path('/var/www/gosti/backups/20261030-guide-hero-compact')
assert hashlib.sha256(c.read_bytes()).hexdigest()=='e3b374313fcdc893e03b193d6ce40df3a601b17fbfe50f6f0b8754b539a54502'
assert not backup.exists();backup.mkdir();shutil.copy2(c,backup/'nginx.conf')
css=Path(__file__).with_name('patch.css').read_text()
old='1m2h-bath-gallery-guide-v2-20261030.css';new='1m2h-guide-hero-compact-20261030.css';f=b/'.next/static/chunks'/old;shutil.copy2(f,backup/old);(b/'.next/static/chunks'/new).write_bytes(f.read_bytes()+css.encode())
for f in (b/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes()
 if old.encode()in raw:
  d=backup/f.relative_to(b);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(raw.replace(old.encode(),new.encode()))
c.write_text(c.read_text().replace(old,new));subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
