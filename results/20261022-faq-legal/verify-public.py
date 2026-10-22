from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
import hashlib,json,urllib.request

stage=Path(__file__).resolve().parent
raw=urllib.request.urlopen('https://tangerin.ru/api/content',timeout=30).read();(stage/'published-content-after.json').write_bytes(raw)
a={e['key']:e for e in json.loads((stage/'published-content-before.json').read_bytes())['entries']};b={e['key']:e for e in json.loads(raw)['entries']};assert a.keys()==b.keys()
changed=[k for k in a if a[k]!=b[k]];assert set(changed)=={'landing','main-menu','site-footer'}
expected={e['key']:e for e in json.loads((stage/'preview-content.json').read_text(encoding='utf-8'))['entries']}
for key in changed:assert b[key]['data']==expected[key]['data']
for key in ['faq-1','faq-2','faq-3','faq-4','faq-5','faq-6','site-legal-documents','doma/limon']:assert a[key]==b[key]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.legal=False;self.legalDepth=0;self.legalText='';self.legalLinks=[];self.legalCount=0;self.menus=[];self.footer=False;self.oldLabel=False;self.skip=0;self.booking=0
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag in ['script','style']:self.skip+=1
  if tag=='footer'and'site-footer'in d.get('class','').split():self.footer=True
  if d.get('id')=='footer-booking':self.booking+=1
  if d.get('id')=='documents-and-contacts':self.legal=True;self.legalDepth=1;self.legalCount+=1
  elif self.legal and tag=='section':self.legalDepth+=1
  if self.legal and tag=='a':self.legalLinks.append(d.get('href',''))
 def handle_data(self,data):
  if self.skip:return
  if 'Вопрос-ответ'in data:self.oldLabel=True
  if self.legal:self.legalText+=data
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.skip=max(0,self.skip-1)
  if tag=='section'and self.legal:
   self.legalDepth-=1
   if self.legalDepth==0:self.legal=False
def check(e):
 route='/'if e['key']=='home'else'/'+e['key']
 with urllib.request.urlopen('https://tangerin.ru'+route,timeout=40)as r:status=r.status;html=r.read().decode()
 p=Page();p.feed(html);assert status==200 and not p.oldLabel,(route,status,p.oldLabel)
 assert '1m2h-faq-legal-v4-20261022.css'in html,(route,'stale CSS reference')
 assert p.legalCount==1 and 'Частые вопросы'not in p.legalText,(route,p.legalCount)
 for target in ['/usloviya-bronirovaniya','/soglasie-na-obrabotku-personalnyh-dannyh','/politika-obrabotki-personalnyh-dannyh','#cookie-settings','https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a']:assert target in p.legalLinks,(route,target)
 assert '444400198704'in p.legalText and '326440000006023'in p.legalText and '47, кв. 1.'in p.legalText
 if route=='/':assert '>Частые вопросы<'in html
 if route not in ['/soglasie-na-obrabotku-personalnyh-dannyh','/usloviya-bronirovaniya','/politika-obrabotki-personalnyh-dannyh']:
  assert 'href="/#rules">Частые вопросы</a>'in html or 'href="#rules">Частые вопросы</a>'in html
  assert '3cltmr-faq-menu-v2-20261022.js'in html,(route,'stale navigation reference')
 return{'route':route,'status':status,'legalCards':p.legalCount,'oldFAQLabel':p.oldLabel,'legalFAQRemoved':True,'documentLinksPreserved':True,'bookingHost':p.booking}
with ThreadPoolExecutor(max_workers=5)as pool:checks=list(pool.map(check,[e for e in b.values()if e['kind']=='page']))
plan=json.loads((stage/'plan.json').read_text(encoding='utf-8'))
for item in plan['additions']:
 with urllib.request.urlopen('https://tangerin.ru/'+item['path'].replace('.next/','_next/',1),timeout=30)as response:assert hashlib.sha256(response.read()).hexdigest()==item['sha256']
result={'pages':len(checks),'changedPublicEntries':changed,'FAQAnswersAndLegalDocumentsPreserved':True,'limonFixPreserved':True,'activeAssetReferencesVerified':True,'assetSHAsVerified':True,'publishedApiSha256':hashlib.sha256(raw).hexdigest(),'checks':checks}
(stage/'public-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in result.items()if k!='checks'},ensure_ascii=False))
