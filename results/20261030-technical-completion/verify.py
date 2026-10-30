from pathlib import Path
from bs4 import BeautifulSoup
import urllib.request,json,hashlib,concurrent.futures,shutil,os
b=Path('GoSTI44-production-20261020');p=b/'changes/20261030-technical-completion'
raw=urllib.request.urlopen('https://tangerin.ru/api/content',timeout=30).read();d=json.loads(raw)
for f in [b/'public-evidence/published-content.json',p/'published-after.json']:f.write_bytes(raw)
urls=['https://tangerin.ru/']+['https://tangerin.ru/'+x['key']for x in d['entries']if x['kind']=='page'and x['key']!='home']
def check(url):
 r=urllib.request.urlopen(url,timeout=30);s=BeautifulSoup(r.read(),'html.parser')
 assert r.status==200 and len(s.select('h1'))==1
 assert s.title and s.select_one('meta[name=description]')['content']
 assert s.select_one('link[rel=canonical]')['href'].rstrip('/')==url.rstrip('/')
 schemas=[json.loads(e.get_text())for e in s.select('script[type="application/ld+json"]')]
 types=[]
 for sc in schemas:
  nodes=sc.get('@graph',[sc])
  for n in nodes:
   if '@type'in n:types.append(n['@type'])
 assert schemas,(url,'schema missing')
 assert s.select_one('a[href="https://ok.ru/group/70000044385070"]')
 return {'url':url,'status':r.status,'h1':1,'schemaTypes':types}
with concurrent.futures.ThreadPoolExecutor(max_workers=5)as ex:pages=list(ex.map(check,urls))
# Mirror only the exact task payloads; no old local files go to production.
for phase in ['payload','followup','poster','hero']:
 for f in (p/phase).rglob('*'):
  if f.is_file():
   dst=b/'runtime'/f.relative_to(p/phase);dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(f,dst)
for name in ['1m2h-tech-v3-20261030.css','1m2h-tech-v4-20261030.css','critical-home-20261030.css','critical-home-v2-20261030.css','critical-home-v3-20261030.css','home-only-20261030.css']:
 content=urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+name).read()
 (b/'runtime/.next/static/chunks'/name).write_bytes(content)
for f in (b/'runtime/.next/server/app').rglob('page_client-reference-manifest.js'):
 data=f.read_bytes()
 if b'1m2h-tech-v3-20261030'in data:f.write_bytes(data.replace(b'1m2h-tech-v3-20261030',b'1m2h-tech-v4-20261030'))
result={'pages':pages,'apiSHA':hashlib.sha256(raw).hexdigest()}
(p/'production-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),'utf8')
print({'pages':len(pages),'apiSHA':result['apiSHA'],'schemaTypes':list(set(str(t)for row in pages for t in row['schemaTypes']))})

