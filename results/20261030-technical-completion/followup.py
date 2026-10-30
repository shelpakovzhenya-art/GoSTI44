from pathlib import Path
import json,hashlib,re
p=Path('GoSTI44-production-20261020/changes/20261030-technical-completion');payload=p/'payload';out=p/'followup';spec=[]
def save(rel,new,old=None):
 f=out/rel;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(new);spec.append({'path':rel,'sha256':hashlib.sha256(new).hexdigest(),'before':hashlib.sha256(old).hexdigest()if old else None})
for rel in ['.next/server/chunks/ssr/_1dhd4r3._.js','.next/server/chunks/ssr/_1nl3cbl._.js','.next/server/chunks/ssr/_0eio92g._.js','.next/static/chunks/3cltmr-tech-20261030.js']:
 raw=(payload/rel).read_bytes();s=raw.decode()
 s,n=re.subn(r',?"aria-label":"ТАНЖЕРИН место, где Вы дома — на главную",?',lambda m:','if m[0].startswith(',')and m[0].endswith(',')else'',s)
 # Match property separators carefully; no empty comma pair.
 s=s.replace(',,',',')
 save(rel.replace('3cltmr-tech-20261030','3cltmr-tech-v2-20261030'),s.encode(),raw if '/server/'in rel else None)
for rel in ['.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js','.next/static/chunks/1iyslc2xp3jm8-tech-20261030.js']:
 raw=(payload/rel).read_bytes();s=raw.decode()
 s,n=re.subn(r',"aria-label":\x60\$\{\w+\.name\} \$\{\w+\.rating\} ★★★★★ —[^\x60]+\x60','',s);assert n==1
 if 'function HeroClientVideo()'in s:
  target='if(disposed||m.matches||document.hidden||!el.paused)return;'
  assert s.count(target)==1
  s=s.replace(target,'if(disposed||m.matches||matchMedia("(max-width:767px)").matches||document.hidden||!el.paused)return;')
 save(rel.replace('1iyslc2xp3jm8-tech-20261030','1iyslc2xp3jm8-tech-v2-20261030'),s.encode(),raw if '/server/'in rel else None)
css=(payload/'.next/static/chunks/1m2h-tech-20261030.css').read_bytes()
prefix='html:not('+('#client-letter-20261029'*12)+') '
extra='@layer clientLetter{'+prefix+'a[id^="_bnovo_link"],'+prefix+'.fl-legal-note{opacity:1!important;color:#514b40!important}}'
save('.next/static/chunks/1m2h-tech-v2-20261030.css',css+extra.encode())
for f in (payload/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes();s=raw
 for name in ['3cltmr','1iyslc2xp3jm8','1m2h']:s=s.replace((name+'-tech-20261030').encode(),(name+'-tech-v2-20261030').encode())
 save(f.relative_to(payload).as_posix(),s,raw)
(p/'followup.json').write_text(json.dumps(spec,indent=2),'utf8')
print({'files':len(spec)})

