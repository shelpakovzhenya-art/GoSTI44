from pathlib import Path
import hashlib,shutil,subprocess,json
base=Path('/var/www/gosti/releases/20260925-2/.next/standalone')
backup=Path('/var/www/gosti/backups/20261030-remove-video-button');assert not backup.exists();backup.mkdir()
paths={'.next/static/chunks/1iyslc2xp3jm8-tech-v5-20261030.js':'77519765cced9cb09aedf8778385248ef8f4f4e9af332ce449838dc9896117af','.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js':'a957dbcf6aba6ae2dd3e1ee2e5a03d146212f79907b0a4cad96e910f808baf86'}
changes={}
for rel,sha in paths.items():
 f=base/rel;raw=f.read_bytes();assert hashlib.sha256(raw).hexdigest()==sha
 s=raw.decode();start=s.index(',(0,e.jsx)("button",{type:"button",className:"hero-video-toggle"') if '/static/'in rel else s.index(',(0,b.jsx)("button",{type:"button",className:"hero-video-toggle"')
 if '/static/'in rel:
  end=s.index(']})}function V',start)
  s=s[:start]+s[end:]
  s=s.replace('||matchMedia("(max-width:767px)").matches','')
  target=rel.replace('tech-v5','no-video-control')
 else:
  end=s.index('})',start)+2;s=s[:start]+s[end:];target=rel
 assert 'hero-video-toggle'not in s
 d=backup/rel;d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d)
 (base/target).write_bytes(s.encode());changes[target]=hashlib.sha256(s.encode()).hexdigest()
for f in (base/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes()
 if b'1iyslc2xp3jm8-tech-v5-20261030'in raw:
  d=backup/f.relative_to(base);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d)
  new=raw.replace(b'1iyslc2xp3jm8-tech-v5-20261030',b'1iyslc2xp3jm8-no-video-control-20261030');f.write_bytes(new);changes[f.relative_to(base).as_posix()]=hashlib.sha256(new).hexdigest()
subprocess.run(['systemctl','restart','gosti'],check=True)
print(json.dumps(changes))
