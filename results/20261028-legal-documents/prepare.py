from pathlib import Path
import copy,hashlib,html,json,re,shutil,urllib.request,zipfile,xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
p=Path(__file__).resolve().parent;work=p/'.work';base=p.parent.parent/'source';payload=work/'payload'
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=urllib.request.urlopen('https://tangerin.ru/api/content').read();api=json.loads(raw)
before={e['key']:e for e in api['entries']};after=copy.deepcopy(before)
def data(key):return after[key]['data']
def strings(obj,fn):
 if isinstance(obj,str):return fn(obj)
 if isinstance(obj,list):return [strings(v,fn)for v in obj]
 if isinstance(obj,dict):return {k:strings(v,fn)for k,v in obj.items()}
 return obj
def bath_words(s):
 return s.replace('Баня и купель','Баня').replace('баня и купель','баня').replace('баней и купелью','баней').replace('бане и купели','бане')
for e in after.values():e['data']=strings(e['data'],bath_words)
# Remove the retired service and its photographs from every active presentation.
b=data('vse-dlya-otdyha/banya-i-kupel');s=BeautifulSoup(b['body'],'html.parser')
cards=s.select('.client-bath-card');assert len(cards)==2;cards[1].decompose()
s.select_one('#sc-hero-copy-bath p').string='После насыщенного дня приятно согреться в бане и провести время в уютной обстановке'
s.select_one('#bath-booking h2').string='Как заказать баню'
s.select_one('#bath-booking p').string='Сообщите нам заранее о своем желании посетить баню, и мы согласуем дату и время.'
description='Баня в доме «Лайм» в Костроме — 7 700 ₽ за 3 часа, до 6 гостей. Парилка, чайный стол, веники и полотенца включены.'
for tag in s.select('script[type="application/ld+json"]'):
 j=json.loads(tag.string);j['name']='Баня';j['description']=description;tag.string=json.dumps(j,ensure_ascii=False,separators=(',',':'))
b.update(title='Баня',description=description,body=str(s));b['seo'].update(title='Баня в Костроме — гостевые дома Танжерин',h1='Баня',description=description)
data('service-bath')['description']='Баня — 7 700 ₽ за 3 часа, до 6 гостей.'
overview=data('vse-dlya-otdyha');s=BeautifulSoup(overview['body'],'html.parser');s.select_one('#sc-uniform-bath .rs-service-card-copy p').string='После насыщенного дня приятно согреться в бане и провести время в уютной обстановке';overview['body']=str(s)
lime=data('lime');lime['images']=[x for x in lime['images']if not re.search('купел|bath-empty',json.dumps(x,ensure_ascii=False),re.I)];lime['amenities']=[x for x in lime['amenities']if not re.search('купел',x,re.I)]
limepage=data('doma/laym');s=BeautifulSoup(limepage['body'],'html.parser')
for li in s.select('li'):
 if 'Купель' in li.get_text():li.decompose()
limepage['body']=str(s).replace(' Купель — по тарифу.','')
for key in ['photo-gallery','gallery']:
 d=data(key)
 for field,arr in list(d.items()):
  if isinstance(arr,list):d[field]=[x for x in arr if not re.search('купел|gallery-08.webp',json.dumps(x,ensure_ascii=False),re.I)]
# Remove stale copy in the old service text dictionary, which remains editable in CMS.
hol=data('holiday-sections')
for t in hol.get('texts',[]):
 if re.search('купел',t.get('value',''),re.I):
  t['value']={'025':'В «Лайме» есть собственная баня и чайная зона. Ими пользуются только гости этого дома.','027':'','034':'Баня доступна только гостям дома «Лайм». Условия и стоимость согласуем до приезда.'}.get(t['key'],'')
# Public documents: preserve supplied paragraphs, with the clear spelling correction
# from the client's named operator. Source DOCX files are published unchanged.
documents=[('условия бронирования и оплаты','usloviya-bronirovaniya','Условия бронирования, оплаты и отмены'),('согласие на обработку','soglasie-na-obrabotku-personalnyh-dannyh','Согласие на обработку персональных данных'),('правила проживания','pravila-prozhivaniya','Правила проживания'),('политика Яколвев','politika-obrabotki-personalnyh-dannyh','Политика обработки персональных данных'),('договор офферты','dogovor-oferta','Договор-оферта')]
new=[];source_hashes=[]
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
for source,slug,title in documents:
 f=Path('C:/Users/della/Downloads')/(source+'.docx')
 with zipfile.ZipFile(f)as z:
  root=ET.fromstring(z.read('word/document.xml'));paras=[''.join(t.text or '' for t in x.findall('.//w:t',ns)).strip()for x in root.findall('.//w:p',ns)];paras=[x for x in paras if x]
 content=[]
 for i,text in enumerate(paras):
  if i==0:continue
  # The changes file explicitly removes the retired amenity. Apply that instruction
  # to the published rules too; leave the author's original download intact.
  if source=='правила проживания':
   text=text.replace('Парковка, баня, купель и мангал','Парковка, баня и мангал').replace('Пользование баней и купелью необходимо согласовать заранее; возможность зависит от их доступности и занятости. Услуги оплачиваются отдельно.','Пользование баней необходимо согласовать заранее; возможность зависит от её доступности и занятости. Баня оплачивается отдельно.')
  text=text.replace('Яколвеву Андрею','Яковлеву Андрею')
  tag='h2' if re.match(r'^\d+\.\s',text)else'p';content.append(f'<{tag}>{html.escape(text)}</{tag}>')
 download='/documents/20261028/'+slug+'.docx';dest=payload/'public'/download.lstrip('/');dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
 source_hashes.append({'sourceName':f.name,'sha256':sha(f.read_bytes()),'publicUrl':download})
 body='<article class="client-legal-document" id="legal-document-'+slug+'">'+''.join(content)+f'<p class="legal-download"><a href="{download}" download>Скачать исходный документ DOCX</a></p>'
 links=[('usloviya-bronirovaniya','Условия бронирования, оплаты и отмены'),('pravila-prozhivaniya','Правила проживания'),('dogovor-oferta','Договор-оферта')]
 if slug in [x[0]for x in links]:body+='<nav aria-label="Связанные документы">'+''.join(f'<p><a href="/{u}">{label}</a></p>'for u,label in links if u!=slug)+'</nav>'
 body+='</article>'
 d={'template':'standard','title':title,'description':'','body':body,'images':[],'buttons':[],'texts':[],'seo':{'title':title+' — ТАНЖЕРИН','h1':title,'description':title+' гостевого дома «ТАНЖЕРИН» в Костроме.'}}
 if slug in after:after[slug]['data']=d
 else:new.append({'kind':'page','key':slug,'name':title,'data':d})
# Nine questions in precisely the client-supplied order and wording.
paras=(work/'правки.txt').read_text(encoding='utf8').splitlines();start=paras.index('1. Во сколько заезд и выезд?');items=[]
for text in paras[start:]:
 if re.match(r'^\d\. ',text):items.append({'title':re.sub(r'^\d\. ','',text),'description':''})
 elif text.strip() and text.strip()!='Подробнее об условиях бронирования':items[-1]['description']+=((' 'if items[-1]['description']else'')+text.strip())
assert len(items)==9
for i,item in enumerate(items,1):
 key='faq-'+str(i)
 if key in after:after[key]['data']=item
 else:new.append({'kind':'faq','key':key,'name':item['title'],'data':item,'position':1000+i})
# Replace the legal cards with plain contacts and the six requested document links.
footer=data('site-footer');s=BeautifulSoup(footer['body'],'html.parser');legal=s.select_one('#documents-and-contacts');assert legal
legal.clear();legal['class']=['site-legal','client-compact-legal']
legal.append(BeautifulSoup('<p class="eyebrow">ПРАВОВАЯ ИНФОРМАЦИЯ</p><div class="compact-legal-columns"><address><p>Кострома, ул. Октябрьская, 45А</p><p><a href="tel:+79109535855">+7 (910) 953-58-55</a></p><p><a href="mailto:sudja2000@list.ru">sudja2000@list.ru</a></p></address><div><nav class="site-legal-links" aria-label="Документы и условия бронирования"><a class="tc-footer-settings-link" href="#cookie-settings">Настройка cookies</a><a href="https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a" target="_blank" rel="noreferrer">Условия и стоимость бронирования</a></nav><p class="fl-legal-note">Документы доступны для ознакомления до бронирования.</p></div></div>','html.parser'))
footer['body']=str(s)
doclinks=documents[:2]+[documents[3],documents[2]]
data('site-legal-documents')['body']='<div id="legal-documents">'+''.join(f'<a href="/{slug}">{title}</a>'for source,slug,title in doclinks)+'</div>'
cookies=data('cookies')
for t in cookies.get('texts',[]):
 if 'Гагарин' in t.get('value',''):t['value']=re.sub(r' Владелец сайта —.*','',t['value'])
# Also remove the amenity from all remaining public promotional copy.
for e in after.values():
 if e['key']=='doma/laym':e['data']=strings(e['data'],lambda s:s.replace(' Купель — по тарифу.',''))
edits=[{'key':k,'kind':before[k]['kind'],'before':before[k]['data'],'after':e['data']}for k,e in after.items()if e['data']!=before[k]['data']]
(work/'content-patch.json').write_text(json.dumps({'edits':edits,'creates':new},ensure_ascii=False,indent=2),encoding='utf8')
preview=copy.deepcopy(api)
for e in preview['entries']:e['data']=after[e['key']]['data']
preview['entries'] +=[{k:v for k,v in e.items()if k in ['key','kind','data']}for e in new]
(work/'preview-content.json').write_text(json.dumps(preview,ensure_ascii=False),encoding='utf8')
(p/'source-hashes.json').write_text(json.dumps(source_hashes,ensure_ascii=False,indent=2),encoding='utf8')
print('Prepared CMS edits:',[x['key']for x in edits],'; new:',[x['key']for x in new])
