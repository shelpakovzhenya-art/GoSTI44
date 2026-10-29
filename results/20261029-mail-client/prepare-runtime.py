from pathlib import Path
import json,hashlib,re
p=Path(__file__).resolve().parent;b=p.parent.parent;payload=p/'payload'
sha=lambda x:hashlib.sha256(x).hexdigest()
manifest=json.loads((b/'runtime-manifest.json').read_text('utf8'))
names={'1m2h-bath-compact-20261028.css':'1m2h-client-letter-v7-20261029.css','3cltmr-bnovo-reliable-20261029.js':'3cltmr-client-letter-v2-20261029.js','1iyslc2xp3jm8-bnovo-reliable-20261029.js':'1iyslc2xp3jm8-client-letter-v2-20261029.js'}
guards=[];replacements=[]
image_map=json.loads((p/'image-map.json').read_text('utf8')) if (p/'image-map.json').exists() else {}
def optimize(s):
 for old,new in image_map.items():s=s.replace(old,new)
 return s
def scoped_css(css):
 # Earlier production styles contain repeated ID selectors. Match their specificity
 # only for this bounded patch, without changing the shared historical stylesheet.
 prefix='html:not('+('#client-letter-20261029'*12)+') '
 css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
 def selector(m):
  value=m.group(1).strip()
  if value.startswith('@'):return value+'{'
  return ','.join(prefix+x.strip() for x in value.split(','))+'{'
 return re.sub(r'([^{}]+)\{',selector,css)

def save(rel,blob,old=None):
 dest=payload/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(blob)
 if old is not None:replacements.append({'path':rel,'beforeSha256':sha(old),'afterSha256':sha(blob)})
def remove_element(s,classname):
 marker='className:"'+classname+'"';assert s.count(marker)==1
 i=s.index(marker);m=list(re.finditer(r'\(0,[\w]+\.jsxs?\)\(',s[:i]))[-1];start=m.start();opening=m.end()-1
 level=0;quote=None;escape=False
 for n in range(opening,len(s)):
  c=s[n]
  if quote:
   if escape:escape=False
   elif c=='\\':escape=True
   elif c==quote:quote=None
   continue
  if c in ['"',"'",'`']:quote=c
  elif c=='(':level+=1
  elif c==')':
   level-=1
   if level==0:return s[:start]+'null'+s[n+1:]
 raise AssertionError('Unbalanced JSX call')
def home(s):
 pattern=r'\(0,(\w+)\.jsxs\)\("p",\{children:\[\(0,\1\.jsx\)\((\w+)\.CmsText,\{id:"landing\.031"\}\)," ",\(0,\1\.jsx\)\("br",\{className:"desktop-break"\}\)," ",\(0,\1\.jsx\)\(\2\.CmsText,\{id:"landing\.032"\}\)\]\}\)'
 s,n=re.subn(pattern,'null',s);assert n==1
 s=remove_element(s,'about-reference-invitation')
 # Only the ratings instance next to the date, not the top summary.
 pat=r'\(0,(\w+)\.jsx\)\(\w+,\{\}\),(?=\(0,\1\.jsxs\)\("p",\{className:"ratings-date")'
 s,n=re.subn(pat,'null,',s);assert n==1
 s=remove_element(s,'ratings-date')
 old='src:"/images/hero.jpg",alt:"Общий сад и территория у гостевых домов «Танжерин»"'
 assert s.count(old)==1
 s=s.replace(old,'src:"/media/client-20261029/about-veranda.webp",alt:"Веранда гостевого дома «Танжерин»"')
 assert s.count('className:"image-dots","aria-label"')==1
 s=s.replace('className:"image-dots","aria-label"','className:"image-dots",role:"img","aria-label"')
 video='src:"/media/client-20261014/hero-fullbleed.mp4",poster:'
 assert s.count(video)==1
 s=s.replace(video,'"data-src":"/media/client-20261014/hero-fullbleed.mp4",poster:').replace('autoPlay:true,muted:true,loop:true,playsInline:true,preload:"auto"','autoPlay:false,muted:true,loop:true,playsInline:true,preload:"none"')
 if 'function HeroClientVideo()' in s:
  s=s.replace('useState)(true),v=(0,N.useRef)(null)','useState)(false),v=(0,N.useRef)(null)')
  old='el.muted=true;el.defaultMuted=true;el.playsInline=true;const p=el.play();'
  assert old in s
  s=s.replace(old,'if(!el.getAttribute("src"))el.src=el.dataset.src;'+old)
  old='m.addEventListener("change",motion);motion();return()=>{disposed=true;'
  assert old in s
  s=s.replace(old,'m.addEventListener("change",motion);let startTimer;const start=()=>{startTimer=setTimeout(motion,350)};if(document.readyState==="complete")start();else window.addEventListener("load",start,{once:true});return()=>{disposed=true;clearTimeout(startTimer);window.removeEventListener("load",start);')
  s=s.replace('let el=v.current;el.paused?el.play()','let el=v.current;if(!el.getAttribute("src"))el.src=el.dataset.src;el.paused?el.play()')
 else:
  old='className:"hero-video-toggle","aria-label":"Приостановить видео",children:"Пауза"'
  assert old in s
  s=s.replace(old,'className:"hero-video-toggle","aria-label":"Воспроизвести видео",children:"Смотреть видео"')
 return optimize(s)
def common(s):
 pat=r'\{name:"ВКонтакте",label:"Связаться во ВКонтакте",href:\w+\.vk,className:"social-vk",path:"[^"]+"\}'
 s,n=re.subn(pat,'{name:"WhatsApp",label:"Написать в WhatsApp",href:"https://wa.me/79109535855",className:"social-whatsapp",image:"/brand/whatsapp-original-20261029.svg"}',s);assert n==1
 return optimize(s)
for old,new in names.items():
 rel='.next/static/chunks/'+old;raw=(b/'runtime'/rel).read_bytes();guards.append({'path':rel,'sha256':sha(raw)})
 if old.endswith('.css'):blob=b'@layer clientLetter;\n'+raw+b'\n'+('@layer clientLetter{'+scoped_css((p/'client.css').read_text('utf8'))+'}').encode()
 else:blob=(home if old.startswith('1iys')else common)(raw.decode()).encode()
 save('.next/static/chunks/'+new,blob)
for name in ['_1dhd4r3._.js','_1nl3cbl._.js','src_components_landing_tsx_0km0ti4._.js']:
 rel='.next/server/chunks/ssr/'+name;raw=(b/'runtime'/rel).read_bytes();save(rel,(home if name.startswith('src_')else common)(raw.decode()).encode(),raw)
for route in ['page','[...slug]/page','preview/page','editor-preview/page','_not-found/page']:
 rel='.next/server/app/'+route+'_client-reference-manifest.js';raw=(b/'runtime'/rel).read_bytes();blob=raw
 for old,new in names.items():blob=blob.replace(old.encode(),new.encode())
 assert blob!=raw;save(rel,blob,raw)
rows={r['path']:r for r in manifest['entries']};additions=[]
for file in payload.rglob('*'):
 if not file.is_file():continue
 rel=file.relative_to(payload).as_posix();blob=file.read_bytes()
 if rel not in rows:additions.append({'path':rel,'sha256':sha(blob)})
 rows[rel]={'path':rel,'type':'file','bytes':len(blob),'sha256':sha(blob)}
entries=sorted(rows.values(),key=lambda x:x['path'])
summary={'files':sum(r['type']=='file'for r in entries),'links':sum(r['type']=='link'for r in entries),'bytes':sum(r.get('bytes',0)for r in entries),'treeSha256':sha(json.dumps(entries,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(p/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':entries},ensure_ascii=False,indent=2),'utf8')
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261029-mail-client','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha((p/'before.json').read_bytes()),'guards':guards,'additions':additions,'replacements':replacements}
(p/'plan.json').write_text(json.dumps(plan,indent=2),'utf8')
print(json.dumps({'added':len(additions),'replaced':len(replacements),'runtimeAfter':summary}))

