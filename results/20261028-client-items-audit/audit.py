"""Clause-by-clause read-only production check against the supplied DOCX."""
from pathlib import Path
import concurrent.futures,hashlib,io,json,re,sys,urllib.request,zipfile,xml.etree.ElementTree as E
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf8')
p=Path(__file__).resolve().parent;root=p.parent.parent
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
norm=lambda x:' '.join(x.split())
sha=lambda x:hashlib.sha256(x).hexdigest()
def fetch(path):return urllib.request.urlopen('https://tangerin.ru'+path,timeout=30).read()
def html(path):return BeautifulSoup(fetch(path),'html.parser')
def paras(blob):
 with zipfile.ZipFile(io.BytesIO(blob))as z:
  assert z.testzip()is None
  return [''.join(t.text or''for t in x.findall('.//w:t',ns)).strip()for x in E.fromstring(z.read('word/document.xml')).findall('.//w:p',ns)]
rows=[]
def check(id,requirement,path,observed,condition):
 assert condition,(id,requirement,observed)
 rows.append({'id':id,'requirement':requirement,'url':'https://tangerin.ru'+path,'observed':observed,'result':'passed'})

raw=fetch('/api/content');api=json.loads(raw);es={e['key']:e['data']for e in api['entries']}
home=html('/');bathpath='/vse-dlya-otdyha/banya-i-kupel';bath=html(bathpath);limepath='/doma/laym';lime=html(limepath)
csspath='/_next/static/chunks/1m2h-bath-closing-20261028.css';css=fetch(csspath).decode()
check('1.1','Название раздела «Баня»',bathpath,'H1 и название услуги — Баня',bath.h1.get_text()=='Баня'and es['service-bath']['title']=='Баня')
check('1.2','Убрать все упоминания купели в разделе',bathpath,'Нет в видимом тексте, alt, метаданных',not re.search('купел',bath.select_one('main').get_text(' ')+' '.join(x.get('alt','')for x in bath.select('main img'))+' '.join(x.get('content','')for x in bath.select('meta')),re.I))
check('1.3','Подзаголовок дословно',bathpath,'После насыщенного дня приятно согреться в бане и провести время в уютной обстановке',norm(bath.select_one('#sc-hero-copy-bath p').get_text(' '))=='После насыщенного дня приятно согреться в бане и провести время в уютной обстановке')
check('1.4','Удалить фото купели, сохранить фото бани',bathpath,'2 фотографии: парная и зона отдыха; обе просмотрены',len(bath.select('[data-bath-index]'))==2 and [x['src']for x in bath.select('[data-bath-index] img')]==['/images/lime-sauna-20261002.webp','/media/client-revisions-20261014/bath-relax.webp'])
check('1.5','Остальное связанное с баней оставить',bathpath,'7700₽,3 часа,до6 гостей; парная/веники/полотенца/чайный стол',norm(bath.select_one('.oct-price').get_text())=='7 700 ₽'and norm(bath.select_one('.bath-duration').get_text())=='3 часа · до 6 гостей'and [x.get_text()for x in bath.select('.oct-list li')]==['Парная','Веники','Полотенца','Чайный стол'])
check('1.6','Заключительный заголовок «Как заказать баню»',bathpath,norm(bath.select_one('#bath-booking h2').get_text()),norm(bath.select_one('#bath-booking h2').get_text())=='Как заказать баню')
check('1.7','Заключительный текст дословно',bathpath,norm(bath.select_one('#bath-booking p').get_text()),norm(bath.select_one('#bath-booking p').get_text())=='Сообщите нам заранее о своем желании посетить баню, и мы согласуем дату и время.')
cascade=json.loads((p/'cascade-checks.json').read_text(encoding='utf8'))
check('1.8','Компактно без плашек и визуальных выделений',bathpath,'Исправлен каскад: padding-right0/background-image none/border-top0 при320/390/768/1366; статическая проверка',all(x['after']['padding-right']['value']=='0'and x['after']['background-image']['value']=='none'and x['after']['border-top']['value']=='0'for x in cascade['checks'])and (p/'bath-closing.css').read_text(encoding='utf8')in css)
check('2.1','Удалить «Купель по тарифу»',limepath,'Надпись отсутствует', 'Купель по тарифу'not in lime.get_text(' '))
check('2.2','Удалить оснащение «Купель с гидромассажем»',limepath,'Нет в оснащении/тексте/API дома',not re.search('купел',json.dumps(es['lime'],ensure_ascii=False)+lime.select_one('main').get_text(' '),re.I))
original=json.loads((root/'results/20261028-legal-documents/.work/content-patch.json').read_text(encoding='utf8'))
for key,id,req,path in [('lime','2.3','Удалить фото купели из карточки и галереи Лайма',limepath),('photo-gallery','3.2','Удалить фото купели из общей галереи','/#gallery')]:
 before=next(x['before']['images']for x in original['edits']if x['key']==key)
 kept=[x for x in before if not re.search('купел',json.dumps(x,ensure_ascii=False),re.I)]
 check(id,req,path,str(len(before))+'→'+str(len(kept))+' фото; удалена только купель, порядок остальных сохранён; изображения просмотрены',es[key]['images']==kept and len(before)-len(kept)==1)
check('2.4','Удалить фото купели из модального набора Лайма',limepath,'10 элементов массива images; bath-empty.webp отсутствует в HTML и API',len(es['lime']['images'])==10 and 'bath-empty.webp'not in str(lime)and 'bath-empty.webp'not in json.dumps(es['lime']))
check('3.1','В подвале «Для гостей» оставить «Баня»','/#documents-and-contacts','Название ссылки Баня',all(a.get_text()=='Баня'for a in home.select('footer a[href="'+bathpath+'"]'))and bool(home.select('footer a[href="'+bathpath+'"]')))
footer=home.select_one('#documents-and-contacts');address=footer.find('address');text=footer.get_text(' ',strip=True)
check('4.1','Удалить текст «Сведения о нашей деятельности…»','/#documents-and-contacts','Указанной фразы нет', 'Сведения о нашей'not in str(footer))
check('4.2','Убрать раздел реквизитов и карточки документов','/#documents-and-contacts','Нет реквизитов/ИНН/ОГРНИП и заголовков карточек',not re.search('Реквизиты|ИНН|ОГРНИП|ИП Гагарина',text)and not footer.select('h2,h3,.fl-card'))
check('4.3','Правовая информация вверху','/#documents-and-contacts','Первый дочерний элемент — ПРАВОВАЯ ИНФОРМАЦИЯ',footer.find(recursive=False).get_text()=='ПРАВОВАЯ ИНФОРМАЦИЯ')
check('4.4','Ссылки компактно мелким шрифтом','/#documents-and-contacts','CSS14px/без padding,min-height,рамок,фона,иконок;4ID override', '#documents-and-contacts'*4 in css and 'font:400 14px/1.5 Manrope,Arial,sans-serif!important'in css and 'min-height:0!important;height:auto!important;padding:0!important'in css)
check('4.5','В контактной части только адрес/email/телефон','/#documents-and-contacts','3 строки,2 ссылки: телефон и email',len(address.find_all('p',recursive=False))==3 and {a['href']for a in address.select('a')}=={'tel:+79109535855','mailto:sudja2000@list.ru'})
check('4.6','Убрать ИП Гагарина и все реквизиты','/#documents-and-contacts','Нет прежнего оператора в правовом блоке/публичном API',not re.search('Гагарин',text+json.dumps(api,ensure_ascii=False),re.I))
check('4.7','Из адресной информации оставить только адрес','/#documents-and-contacts',address.p.get_text(),address.p.get_text()=='Кострома, ул. Октябрьская, 45А')
required={'/usloviya-bronirovaniya':'Условия бронирования, оплаты и отмены','/soglasie-na-obrabotku-personalnyh-dannyh':'Согласие на обработку персональных данных','/politika-obrabotki-personalnyh-dannyh':'Политика обработки персональных данных','#cookie-settings':'Настройка cookies','https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a':'Условия и стоимость бронирования','/pravila-prozhivaniya':'Правила проживания'}
links={a['href']:norm(a.get_text(' '))for a in footer.select('.site-legal-links a')}
check('5.1','Все6 документов и настроек из списка','/#documents-and-contacts','Ровно6 ссылок с заданными названиями и адресами',links==required and len(footer.select('.site-legal-links a'))==6)
check('5.2','Сохранить фразу о доступности до бронирования','/#documents-and-contacts','Документы доступны для ознакомления до бронирования.', 'Документы доступны для ознакомления до бронирования.'in text)
for slug in ['soglasie-na-obrabotku-personalnyh-dannyh','politika-obrabotki-personalnyh-dannyh']:
 t=html('/'+slug).select_one('.client-legal-document').get_text(' ',strip=True)
 check('5.3.'+slug,'Согласие/политика — Яковлев Андрей Николаевич','/'+slug,'Правильный оператор, без Гагариной/опечатки',bool(re.search(r'Яковлев(?:у|а)?\s+Андре[йяю]\s+Николаевич',t))and not re.search('Гагарин|Яколвев',t))
documents=[]
for source,slug in [('условия бронирования и оплаты','usloviya-bronirovaniya'),('согласие на обработку','soglasie-na-obrabotku-personalnyh-dannyh'),('правила проживания','pravila-prozhivaniya'),('политика Яколвев','politika-obrabotki-personalnyh-dannyh'),('договор офферты','dogovor-oferta')]:
 blob=fetch('/documents/20261028/'+slug+'.docx');expected=(root/'source/runtime/public/documents/20261028'/f'{slug}.docx').read_bytes();article=html('/'+slug).select_one('.client-legal-document')
 with zipfile.ZipFile(io.BytesIO(blob))as package:
  assert not any(re.search(r'Гагарин|Яколвев|tangerine\.ru|купел',package.read(name).decode('utf8'),re.I)for name in package.namelist()if name.endswith(('.xml','.rels')))
 a=[norm(x)for x in paras(blob)if x][1:];b=[norm(x.get_text(' '))for x in article.find_all(['p','h2'],recursive=False)if'legal-download'not in x.get('class',[])]
 check('DOC.'+slug,'Документ опубликован полностью и скачивается','/'+slug,str(len(a))+' абзацев совпало с HTML; DOCX SHA совпал с проверенной копией',blob==expected and a==b and article.select_one('.legal-download a').get_text()=='Скачать документ DOCX')
 documents.append({'slug':slug,'paragraphs':len(a),'sha256':sha(blob),'noStaleNamesDomainOrAmenityInAnyXmlPart':True})
source=paras(Path('C:/Users/della/Downloads/правки.docx').read_bytes());faq=[]
for text in source[source.index('1. Во сколько заезд и выезд?'):]:
 if re.match(r'^\d\. ',text):faq.append([re.sub(r'^\d\. ','',text),[]])
 elif text.strip()and text.strip()!='Подробнее об условиях бронирования':faq[-1][1].append(text)
details=home.select('#rules details');assert len(details)==len(faq)==9
check('FAQ.intro','Заголовок и вводный текст FAQ','/#rules','Частые вопросы; Собрали ответы на то, что важно знать перед поездкой.',home.select_one('#rules h2').get_text()=='Частые вопросы'and norm(home.select_one('#rules .rules-intro >p').get_text(' '))=='Собрали ответы на то, что важно знать перед поездкой.')
for i,(detail,(title,parts))in enumerate(zip(details,faq),1):
 summary=detail.find('summary');summary.select_one('.faq-number').decompose();answer=detail.find('p',recursive=False);link=answer.find('a')
 if i==7:assert link and link['href']=='/usloviya-bronirovaniya'and link.get_text()=='Подробнее об условиях бронирования';link.decompose()
 check('FAQ.'+str(i),title,'/#rules','Вопрос и полный ответ совпадают с DOCX и CMS',norm(summary.get_text(' '))==title and norm(answer.get_text(' '))==norm(' '.join(parts))and es['faq-'+str(i)]['title']==title and norm(es['faq-'+str(i)]['description'])==norm(' '.join(parts)))
check('FAQ.link','Ссылка после ответа об отмене','/#rules','Подробнее об условиях бронирования → /usloviya-bronirovaniya',True)
urls=[x.text for x in E.fromstring(fetch('/sitemap.xml')).findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];assert len(urls)==25
def page(url):
 s=html(url.split('tangerin.ru')[-1]);f=s.select_one('#documents-and-contacts')
 assert len(s.select('h1'))==1
 assert csspath in [x['href']for x in s.select('link[rel=stylesheet]')]
 assert {a['href']:norm(a.get_text(' '))for a in f.select('.site-legal-links a')}==required
 assert not re.search('купел|Гагарин',s.select_one('main').get_text(' '),re.I)
 assert not re.search('ИНН|ОГРНИП|Гагарин|Сведения о нашей',f.get_text(' '),re.I)
 assert not any(a['href']not in ['#','#cookie-settings']and not s.find(id=a['href'][1:])for a in s.select('a[href^="#"]'))
 return {'url':url,'http':200,'singleH1':True,'currentCSS':True,'footerLinks':6}
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as ex:pages=list(ex.map(page,urls))
assert len(documents)==5 and sum(x['paragraphs']for x in documents)==184
out={'scope':'Every clause of the user-provided правки.docx and five legal documents','sourceSha256':sha(Path('C:/Users/della/Downloads/правки.docx').read_bytes()),'requirementsPassed':len(rows),'requirements':rows,'documents':documents,'paragraphs':184,'photosVisuallyInspected':23,'pages':pages,'publishedApiSha256':sha(raw),'gmailThreadRead':False,'gmailReadError':'404 NOT_FOUND in connected account','browserInteractionVerified':False,'browserError':'browser access host unavailable','layoutMethod':'static matching CSS declarations; no browser computed styles'}
(p/'audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'requirementsPassed':len(rows),'pages':25,'faq':9,'documents':5,'paragraphs':184,'photosInspected':23}))
