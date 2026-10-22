from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
import hashlib,json,urllib.request

stage=Path(__file__).resolve().parent
raw=urllib.request.urlopen('https://tangerin.ru/api/content',timeout=30).read()
(stage/'published-content-after.json').write_bytes(raw)
a={e['key']:e for e in json.loads((stage/'published-content-before.json').read_bytes())['entries']}
b={e['key']:e for e in json.loads(raw)['entries']}
assert a.keys()==b.keys()
changed=[k for k in a if a[k]!=b[k]]
assert set(changed)=={'landing','site-footer'}
spec=json.loads((stage/'content-patch.json').read_text(encoding='utf-8'))
for e in spec['edits']:
 expected=json.loads(json.dumps(a[e['key']]['data']))
 for t in e['transforms']:expected['body']=expected['body'].replace(t['before'],t['after'])
 for t in e['textTransforms']:next(x for x in expected['texts']if x['key']==t['key'])['value']=t['after']
 assert expected==b[e['key']]['data']

class PageParser(HTMLParser):
 def __init__(self):
  super().__init__();self.in_footer=False;self.anchor=False;self.anchor_text='';self.cta=[];self.helper=[];self.booking=0;self.uid=0;self.footer=0;self.skip=0
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag in ['script','style']:self.skip+=1
  if tag=='footer'and 'site-footer'in d.get('class','').split():self.in_footer=True;self.footer+=1
  if self.in_footer and tag in ['a','button']:self.anchor=True;self.anchor_text=''
  if d.get('id')=='footer-booking':self.booking+=1
  if tag=='a'and d.get('href')=='https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a':self.uid+=1
 def handle_data(self,text):
  if self.skip:return
  if self.anchor:self.anchor_text+=text
  if 'Укажите даты и число гостей'in text:self.helper.append(text)
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.skip=max(0,self.skip-1)
  if tag in ['a','button']and self.anchor:
   if 'Проверить даты'in self.anchor_text:self.cta.append(self.anchor_text)
   self.anchor=False
  if tag=='footer':self.in_footer=False

def check(entry):
 route='/'if entry['key']=='home'else'/'+entry['key']
 with urllib.request.urlopen('https://tangerin.ru'+route,timeout=40)as response:
  status=response.status;html=response.read().decode()
 p=PageParser();p.feed(html)
 assert status==200 and not p.cta and not p.helper,(route,p.cta,p.helper)
 if p.footer:assert p.booking==1 and p.uid>=1,(route,p.booking,p.uid)
 return{'route':route,'status':status,'footer':p.footer,'booking':p.booking,'uidLink':p.uid,'footerCTAs':len(p.cta),'helperCopies':len(p.helper)}
with ThreadPoolExecutor(max_workers=5)as pool:checks=list(pool.map(check,[e for e in b.values()if e['kind']=='page']))
result={'pages':len(checks),'changedPublicEntries':changed,'publishedApiSha256':hashlib.sha256(raw).hexdigest(),'footerCTAsRemoved':True,'helperRemovedAllPages':True,'bookingAndUIDPreserved':True,'checks':checks}
(stage/'public-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in result.items()if k!='checks'},ensure_ascii=False))
