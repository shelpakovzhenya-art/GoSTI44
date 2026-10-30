from pathlib import Path
import shutil,subprocess
base=Path('/var/www/gosti/releases/20260925-2/.next/standalone')
backup=Path('/var/www/gosti/backups/20261030-technical-completion/video-label');backup.mkdir()
c=Path('/etc/nginx/sites-available/gosti');c.write_bytes(Path('/var/www/gosti/backups/20261030-technical-completion/nginx-before-first-screen.conf').read_bytes())
files=[base/'.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js',base/'.next/static/chunks/1iyslc2xp3jm8-tech-v4-20261030.js']
for f in files:
 s=f.read_text();assert 'Воспроизвести видео'in s
 target=f if '/server/'in str(f) else f.with_name('1iyslc2xp3jm8-tech-v5-20261030.js')
 dest=backup/f.relative_to(base);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
 target.write_text(s.replace('Воспроизвести видео','Смотреть видео').replace('Приостановить видео','Пауза'))
for f in (base/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes()
 if b'1iyslc2xp3jm8-tech-v4-20261030' in raw:
  dest=backup/f.relative_to(base);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
  f.write_bytes(raw.replace(b'1iyslc2xp3jm8-tech-v4-20261030',b'1iyslc2xp3jm8-tech-v5-20261030'))
subprocess.run(['nginx','-t'],check=True);subprocess.run(['systemctl','restart','gosti'],check=True);subprocess.run(['systemctl','reload','nginx'],check=True)
print('Stable home styles restored; video accessible name matches text')
