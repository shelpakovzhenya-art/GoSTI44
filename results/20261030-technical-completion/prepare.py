from pathlib import Path
from PIL import Image
from bs4 import BeautifulSoup
import urllib.request,json,hashlib,re
base=Path('GoSTI44-production-20261020');p=base/'changes/20261030-technical-completion';runtime=base/'runtime';payload=p/'payload';mapping={}
for route in ['','doma/laym','doma/limon','doma/citrus']:
 s=BeautifulSoup(urllib.request.urlopen('https://tangerin.ru/'+route).read(),'html.parser')
 for im in s.select('img[data-nimg]'):
  src=im.get('src','')
  if not src.startswith('/') or src.endswith('.svg') or src in mapping:continue
  f=runtime/'public'/src.lstrip('/')
  if not f.is_file():continue
  with Image.open(f)as image:
   if image.width<200:continue
   widths=sorted(set([w for w in [64,128,320,640,960,1280,1600]if w<image.width]+[min(image.width,1600)]))
   key=hashlib.sha256(src.encode()).hexdigest()[:12];variants=[]
   for w in widths:
    copy=image.copy();copy.thumbnail((w,round(w*image.height/image.width)))
    rel='/images/responsive-20261030/'+key+'-'+str(copy.width)+'.webp';out=payload/'public'/rel.lstrip('/');out.parent.mkdir(parents=True,exist_ok=True)
    if not out.exists():copy.save(out,'WEBP',quality=80,method=6)
    variants.append([rel,copy.width])
   mapping[src]=variants
(p/'responsive-map.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2),'utf8')
m=json.dumps(mapping,ensure_ascii=False,separators=(',',':'))
changes=[]
def save(rel,data,old=None):
 out=payload/rel;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(data)
 changes.append({'path':rel,'sha256':hashlib.sha256(data).hexdigest(),'before':hashlib.sha256(old).hexdigest()if old else None})
# Exact getImageProps branch: pre-generated assets work without a dynamic optimizer.
for name in ['_1dhd4r3._.js','_1nl3cbl._.js','_0eio92g._.js']:
 rel='.next/server/chunks/ssr/'+name;raw=(runtime/rel).read_bytes();s=raw.decode()
 anchor='function({config:a,src:b,unoptimized:c,width:e,quality:f,sizes:g,loader:h}){'
 assert s.count(anchor)==1
 add='let responsive='+m+';if(responsive[b]){let v=responsive[b];return{sizes:g||(e?e+"px":"100vw"),srcSet:v.map(x=>x[0]+" "+x[1]+"w").join(", "),src:v[v.length-1][0]}}'
 s=s.replace(anchor,anchor+add)
 # Accessible logo name must include visible slogan.
 s=s.replace('Танжерин — на главную','ТАНЖЕРИН место, где Вы дома — на главную')
 save(rel,s.encode(),raw)
oldCommon='3cltmr-client-letter-v2-20261029.js';newCommon='3cltmr-tech-20261030.js'
raw=(runtime/'.next/static/chunks'/oldCommon).read_bytes();s=raw.decode()
anchor='function({config:e,src:t,unoptimized:r,width:i,quality:a,sizes:o,loader:s}){'
assert s.count(anchor)==1
add='let responsive='+m+';if(responsive[t]){let v=responsive[t];return{sizes:o||(i?i+"px":"100vw"),srcSet:v.map(x=>x[0]+" "+x[1]+"w").join(", "),src:v[v.length-1][0]}}'
s=s.replace(anchor,anchor+add).replace('Танжерин — на главную','ТАНЖЕРИН место, где Вы дома — на главную')
save('.next/static/chunks/'+newCommon,s.encode())
# Avoid decorative stars being included in the visible text alternative.
for rel,newname in [('.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js',None),('.next/static/chunks/1iyslc2xp3jm8-client-letter-v2-20261029.js','1iyslc2xp3jm8-tech-20261030.js')]:
 raw=(runtime/rel).read_bytes();s=raw.decode()
 # Ratings label begins with exact displayed brand and score.
 s,n=re.subn(r'\$\{(\w+)\.name\}: рейтинг \$\{\1\.rating\} из 5\.',lambda z:'${'+z[1]+'.name} ${'+z[1]+'.rating} ★★★★★ —',s)
 assert n==1,rel
 save('.next/static/chunks/'+newname if newname else rel,s.encode(),None if newname else raw)
oldCss='1m2h-client-letter-v8-20261030.css';newCss='1m2h-tech-20261030.css'
prefix='html:not('+('#client-letter-20261029'*12)+') '
rules={'.eyebrow,.house-price,.about-reference-names':'color:#98502f!important',
'.house-book':'color:#273d2e!important',
'.faq-number,.fl-legal-note':'color:#625d50!important',
'a[id^="_bnovo_link"]':'position:relative!important;top:auto!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;min-height:24px!important;margin:6px 0 8px!important;color:#625d50!important;font-size:11px!important'}
extra='\n@layer clientLetter{'+''.join(','.join(prefix+x for x in sel.split(','))+'{'+val+'}'for sel,val in rules.items())+'}'
css=(runtime/'.next/static/chunks'/oldCss).read_bytes()+extra.encode()
save('.next/static/chunks/'+newCss,css)
names={oldCss:newCss,oldCommon:newCommon,'1iyslc2xp3jm8-client-letter-v2-20261029.js':'1iyslc2xp3jm8-tech-20261030.js'}
for f in (runtime/'.next/server/app').rglob('page_client-reference-manifest.js'):
 raw=f.read_bytes();new=raw
 for a,b in names.items():new=new.replace(a.encode(),b.encode())
 if new!=raw:save(f.relative_to(runtime).as_posix(),new,raw)
# Add image files to guarded installation manifest.
known={x['path']for x in changes}
for f in payload.rglob('*'):
 if f.is_file() and f.relative_to(payload).as_posix()not in known:save(f.relative_to(payload).as_posix(),f.read_bytes())
(p/'patch.json').write_text(json.dumps(changes,indent=2),'utf8')
print({'responsiveImages':len(mapping),'variants':sum(map(len,mapping.values())),'patchFiles':len(changes)})

