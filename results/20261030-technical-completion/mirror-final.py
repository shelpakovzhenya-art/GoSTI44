from pathlib import Path
import urllib.request
b=Path('GoSTI44-production-20261020/runtime')
for name in ['first-screen-20261030.css','1iyslc2xp3jm8-tech-v5-20261030.js']:
 (b/'.next/static/chunks'/name).write_bytes(urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+name).read())
f=b/'.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js'
s=f.read_bytes().decode();f.write_bytes(s.replace('Воспроизвести видео','Смотреть видео').replace('Приостановить видео','Пауза').encode())
for f in (b/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes();f.write_bytes(raw.replace(b'1iyslc2xp3jm8-tech-v4-20261030',b'1iyslc2xp3jm8-tech-v5-20261030'))
