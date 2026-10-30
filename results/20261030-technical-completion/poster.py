from pathlib import Path
import re,json,hashlib
p=Path('GoSTI44-production-20261020/changes/20261030-technical-completion');prior=p/'followup';out=p/'poster';spec=[]
def save(rel,data,old=None):
 f=out/rel;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(data);spec.append({'path':rel,'sha256':hashlib.sha256(data).hexdigest(),'before':hashlib.sha256(old).hexdigest()if old else None})
url='/media/client-20261030/hero-poster.webp'
save('public'+url,(p/'hero-poster.webp').read_bytes())
for rel in ['.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js','.next/static/chunks/1iyslc2xp3jm8-tech-v2-20261030.js']:
 raw=(prior/rel).read_bytes();s=raw.decode()
 s=s.replace('/media/client-20261014/hero-poster.jpg',url)
 pattern=r'(children:\[)(\(0,(\w+)\.jsx\)\("video",\{(?:ref:v,)?className:"hero-photo hero-client-video")'
 s,n=re.subn(pattern,lambda m:m[1]+'(0,'+m[3]+'.jsx)("link",{rel:"preload",as:"image",href:"'+url+'",fetchPriority:"high"}),'+m[2],s);assert n==1,rel
 save(rel.replace('tech-v2','tech-v3'),s.encode(),raw if '/server/'in rel else None)
for f in (prior/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes();s=raw.replace(b'1iyslc2xp3jm8-tech-v2',b'1iyslc2xp3jm8-tech-v3');save(f.relative_to(prior).as_posix(),s,raw)
(p/'poster.json').write_text(json.dumps(spec,indent=2),'utf8')

