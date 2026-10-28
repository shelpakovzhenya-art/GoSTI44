from pathlib import Path
import concurrent.futures,hashlib,io,json,re,sys,urllib.request,zipfile,xml.etree.ElementTree as E
from bs4 import BeautifulSoup
p=Path(__file__).resolve().parent;w=p/'.work';ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
normalize=lambda s:' '.join(s.split())
def paragraphs(blob,part='word/document.xml'):
 with zipfile.ZipFile(io.BytesIO(blob))as z:
  root=E.fromstring(z.read(part));return [''.join(t.text or''for t in x.findall('.//w:t',ns)).strip()for x in root.findall('.//w:p',ns)]
def fetch(path):return urllib.request.urlopen('https://tangerin.ru'+path,timeout=30).read()
api=json.loads(fetch('/api/content'));entries={e['key']:e for e in api['entries']}
source=paragraphs(Path('C:/Users/della/Downloads/правки.docx').read_bytes());start=source.index('1. Во сколько заезд и выезд?');faq=[]
for text in source[start:]:
 if re.match(r'^\d\. ',text):faq.append([re.sub(r'^\d\. ','',text),[]])
 elif text.strip()and text.strip()!='Подробнее об условиях бронирования':faq[-1][1].append(text)
assert len(faq)==9
for i,(title,parts)in enumerate(faq,1):
 actual=entries['faq-'+str(i)]['data'];assert actual['title']==title and normalize(actual['description'])==normalize(' '.join(parts))
home=BeautifulSoup(fetch('/'),'html.parser');details=home.select('#rules details');assert len(details)==9
assert all(len(d.find_all('p',recursive=False))==1 for d in details)
assert details[6].find('p',recursive=False).select_one('a[href="/usloviya-bronirovaniya"]')
for detail,(title,parts)in zip(details,faq):
 assert re.sub(r'^[0-9\s]+','',normalize(detail.find('summary').get_text(' ')))==normalize(title)
 answer=detail.find('p',recursive=False)
 for link in answer.find_all('a'):link.decompose()
 assert normalize(answer.get_text(' '))==normalize(' '.join(parts))
documents=[]
for source,slug in [('условия бронирования и оплаты','usloviya-bronirovaniya'),('согласие на обработку','soglasie-na-obrabotku-personalnyh-dannyh'),('правила проживания','pravila-prozhivaniya'),('политика Яколвев','politika-obrabotki-personalnyh-dannyh'),('договор офферты','dogovor-oferta')]:
 local=w/'documents'/f'{slug}.docx';blob=local.read_bytes()if local.exists()else(Path('C:/Users/della/Downloads')/(source+'.docx')).read_bytes()
 public=fetch('/documents/20261028/'+slug+'.docx');assert public==blob,slug
 expected=[normalize(x)for x in paragraphs(blob)if x][1:]
 soup=BeautifulSoup(fetch('/'+slug),'html.parser');article=soup.select_one('.client-legal-document');actual=[normalize(x.get_text(' '))for x in article.find_all(['p','h2'],recursive=False)if 'legal-download'not in x.get('class',[])]
 assert expected==actual,slug
 assert article.select_one('.legal-download a').get_text()=='Скачать документ DOCX'
 assert not re.search('Яколвев|разделе 15|tangerine.ru|купел',' '.join(paragraphs(blob)),re.I),slug
 if slug=='dogovor-oferta':assert 'tangerine.ru'not in' '.join(paragraphs(blob,'word/footer1.xml'))
 documents.append({'url':'https://tangerin.ru/'+slug,'paragraphs':len(expected),'htmlAndDownloadExact':True,'downloadSha256':hashlib.sha256(public).hexdigest()})
required={'/usloviya-bronirovaniya','/soglasie-na-obrabotku-personalnyh-dannyh','/politika-obrabotki-personalnyh-dannyh','/pravila-prozhivaniya','#cookie-settings','https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a'}
urls=[x.text for x in E.fromstring(fetch('/sitemap.xml')).findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];assert len(urls)==25
def inspect(url):
 path=url.split('tangerin.ru')[-1];s=BeautifulSoup(fetch(path),'html.parser');main=s.select_one('main');footer=s.select_one('#documents-and-contacts');assert len(s.select('h1'))==1
 assert len(footer.select('.site-legal-links a'))==6 and {x['href']for x in footer.select('.site-legal-links a')}==required
 assert 'Документы доступны для ознакомления до бронирования.'in normalize(footer.get_text(' '))
 assert footer.select_one('a[href="tel:+79109535855"]')and footer.select_one('a[href="mailto:sudja2000@list.ru"]')
 assert not re.search('Гагарин|Реквизиты|ОГРНИП|ИНН|Сведения о нашей',footer.get_text(' '))
 assert not re.search('купел',main.get_text(' '),re.I),path
 assert not any(x['href']not in ['#cookie-settings','#']and not s.find(id=x['href'][1:])for x in s.select('a[href^="#"]'))
 return {'url':url,'status':200,'singleH1':True,'footerLinks':6,'noBrokenLocalAnchors':True,'noRetiredAmenity':True}
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as ex:pages=list(ex.map(inspect,urls))
bath=BeautifulSoup(fetch('/vse-dlya-otdyha/banya-i-kupel'),'html.parser');assert bath.h1.get_text()=='Баня';assert len(bath.select('[data-bath-index]'))==2
assert normalize(bath.select_one('#sc-hero-copy-bath p').get_text())=='После насыщенного дня приятно согреться в бане и провести время в уютной обстановке'
assert normalize(bath.select_one('#bath-booking h2').get_text())=='Как заказать баню'
assert normalize(bath.select_one('#bath-booking p').get_text())=='Сообщите нам заранее о своем желании посетить баню, и мы согласуем дату и время.'
lime=entries['lime']['data'];assert len(lime['images'])==10;assert not re.search('купел|bath-empty',json.dumps(lime,ensure_ascii=False),re.I)
assert len(entries['photo-gallery']['data']['images'])==11 and len(home.select('#gallery button'))==11
assert home.select_one('#booking-top')and home.select_one('#booking')
css=fetch('/_next/static/chunks/1m2h-compact-legal-20261028.css').decode();assert '#documents-and-contacts'*4 in css and 'min-height:0!important'in css
result={'allMandatoryContentChecksPassed':True,'faqExact':9,'documents':documents,'documentParagraphs':sum(x['paragraphs']for x in documents),'pages':pages,'bathPhotos':2,'limePhotos':10,'galleryPhotos':11,'sourceCorrections':['operatorSurname','retiredAmenityInRules','offerContactReference','offerFooterDomain'],'browserVisualCheck':False}
(p/'final-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps({'documents':len(documents),'matchingParagraphs':result['documentParagraphs'],'faq':9,'pages':len(pages),'allContentChecks':True}))
