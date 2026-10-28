from pathlib import Path
import hashlib,html,json,re,sys,urllib.request,xml.etree.ElementTree as E,zipfile
from bs4 import BeautifulSoup
p=Path(__file__).resolve().parent;w=p/'.work';origin=sys.argv[1]if len(sys.argv)>1 else'http://127.0.0.1:8765'
spec=json.loads((w/'content-patch.json').read_text(encoding='utf8'));sources=json.loads((p/'source-hashes.json').read_text(encoding='utf8'));checks=[]
def page(route):
 r=urllib.request.urlopen(origin+route,timeout=30);assert r.status==200;return BeautifulSoup(r.read(),'html.parser')
def flat(s):return ' '.join(s.split())
expected={e['key']:e['after']for e in spec['edits']};expected.update({e['key']:e['data']for e in spec['creates']})
api=json.loads(urllib.request.urlopen(origin+'/api/content').read());actual={e['key']:e for e in api['entries']}
for key,d in expected.items():assert actual[key]['data']==d,key
home=page('/');details=home.select('#rules details');assert len(details)==9
for i,el in enumerate(details,1):assert actual['faq-'+str(i)]['data']['title']in el.summary.get_text()
assert details[6].select_one('a[href="/usloviya-bronirovaniya"]')
assert home.select_one('#booking-top')and home.select_one('#booking')
assert len(home.select('#gallery button'))==11
assert not any('gallery-08.webp'in str(img)for img in home.select('#gallery img'))
assert 'Купель'not in home.select_one('main').get_text()
bath=page('/vse-dlya-otdyha/banya-i-kupel');root=bath.select_one('#additional-services');assert bath.h1.get_text()=='Баня'
assert not re.search('купел',root.get_text(),re.I)
assert len(root.select('.client-bath-card'))==1 and len(root.select('[data-bath-index]'))==2
assert flat(root.select_one('#bath-booking p').get_text())=='Сообщите нам заранее о своем желании посетить баню, и мы согласуем дату и время.'
lime=page('/doma/laym');assert not re.search('купел',lime.select_one('main').get_text(),re.I)
assert 'bath-empty.webp'not in str(lime.select_one('main'))
for doc in sources:
 route=doc['publicUrl'];b=urllib.request.urlopen(origin+route,timeout=30).read();assert hashlib.sha256(b).hexdigest()==doc['sha256']
 slug=route.rsplit('/',1)[1].removesuffix('.docx');s=page('/'+slug);article=s.select_one('.client-legal-document');assert article
 # All supplied paragraphs appear, with only the declared typo/service corrections.
 f=Path('C:/Users/della/Downloads')/doc['sourceName'];ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
 with zipfile.ZipFile(f)as z:
  paras=[''.join(t.text or''for t in el.findall('.//w:t',ns)).strip()for el in E.fromstring(z.read('word/document.xml')).findall('.//w:p',ns)];paras=[x for x in paras if x]
 for text in paras[1:]:
  text=text.replace('Яколвеву Андрею','Яковлеву Андрею').replace('Парковка, баня, купель и мангал','Парковка, баня и мангал').replace('Пользование баней и купелью необходимо согласовать заранее; возможность зависит от их доступности и занятости. Услуги оплачиваются отдельно.','Пользование баней необходимо согласовать заранее; возможность зависит от её доступности и занятости. Баня оплачивается отдельно.')
  assert flat(text)in flat(article.get_text(' ')),(slug,text[:80])
 checks.append({'route':'/'+slug,'paragraphCoverage':True,'downloadSHA':True})
footer=home.select_one('#documents-and-contacts');ft=footer.get_text(' ',strip=True)
assert not re.search('Гагарин|Реквизиты|ОГРНИП|ИНН|Сведения о нашей',ft)
assert 'Документы доступны для ознакомления до бронирования.'in ft
links=footer.select('.site-legal-links a');assert len(links)==6,[(x.get_text(),x.get('href'))for x in links]
assert {x.get('href')for x in links}=={'/usloviya-bronirovaniya','/soglasie-na-obrabotku-personalnyh-dannyh','/politika-obrabotki-personalnyh-dannyh','/pravila-prozhivaniya','#cookie-settings','https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a'}
for key in ['soglasie-na-obrabotku-personalnyh-dannyh','politika-obrabotki-personalnyh-dannyh']:
 s=page('/'+key);assert 'Гагарин'not in s.select_one('main').get_text()and'Яковлев'in s.select_one('main').get_text()
urls=[x.text for x in E.fromstring(urllib.request.urlopen('https://tangerin.ru/sitemap.xml').read()).findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
paths={url.split('tangerin.ru')[-1]for url in urls}|{'/pravila-prozhivaniya','/dogovor-oferta'};assert len(paths)==25
for path in paths:page(path)
result={'origin':origin,'cmsEditsVerified':len(spec['edits']),'newEntriesVerified':len(spec['creates']),'faqCount':9,'galleryPhotos':11,'bathPhotos':2,'footerDocumentLinks':6,'documentChecks':checks,'paragraphCoverage':True,'http200Pages':len(paths)}
(p/('production-checks.json'if origin.startswith('https:')else'preview-checks.json')).write_text(json.dumps(result,indent=2),encoding='utf8');print(json.dumps(result))
