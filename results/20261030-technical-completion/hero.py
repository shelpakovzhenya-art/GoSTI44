from pathlib import Path
from PIL import Image
import re,json,hashlib
p=Path('GoSTI44-production-20261020/changes/20261030-technical-completion');prior=p/'poster';out=p/'hero';spec=[]
def save(rel,data,old=None):
 f=out/rel;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(data);spec.append({'path':rel,'sha256':hashlib.sha256(data).hexdigest(),'before':hashlib.sha256(old).hexdigest()if old else None})
for w in [640,960]:
 im=Image.open(p/'hero-poster.webp');im.thumbnail((w,w));f=p/('hero-'+str(w)+'.webp');im.save(f,'WEBP',quality=78,method=6);save('public/media/client-20261030/hero-'+str(w)+'.webp',f.read_bytes())
src='/media/client-20261030/hero-poster.webp';sets='/media/client-20261030/hero-640.webp 640w, /media/client-20261030/hero-960.webp 960w, '+src+' 1280w'
for rel in ['.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js','.next/static/chunks/1iyslc2xp3jm8-tech-v3-20261030.js']:
 raw=(prior/rel).read_bytes();s=raw.decode()
 s=s.replace('href:"'+src+'",fetchPriority:"high"','href:"'+src+'",imageSrcSet:"'+sets+'",imageSizes:"100vw",fetchPriority:"high"')
 pattern=r'(\(0,(\w+)\.jsx\)\("video",\{(?:ref:v,)?className:"hero-photo hero-client-video")'
 s,n=re.subn(pattern,lambda m:'(0,'+m[2]+'.jsx)("img",{className:"hero-photo hero-poster",src:"'+src+'",srcSet:"'+sets+'",sizes:"100vw",fetchPriority:"high",loading:"eager",alt:"Территория гостевых домов Танжерин"}),'+m[1],s);assert n==1
 s=s.replace(',poster:"'+src+'"','')
 save(rel.replace('tech-v3','tech-v4'),s.encode(),raw if '/server/'in rel else None)
# Latest manifests from poster phase, CSS reference updated by video-button phase.
for f in (prior/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes().replace(b'1m2h-tech-v2',b'1m2h-tech-v3');s=raw.replace(b'1iyslc2xp3jm8-tech-v3',b'1iyslc2xp3jm8-tech-v4');save(f.relative_to(prior).as_posix(),s,raw)
(p/'hero.json').write_text(json.dumps(spec,indent=2),'utf8')

