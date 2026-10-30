from pathlib import Path
import json, copy
from bs4 import BeautifulSoup

p=Path(__file__).resolve().parent
before=json.loads((p/'before.json').read_text('utf8'));after=copy.deepcopy(before)
entries={e['key']:e for e in after['entries']}
TG='https://t.me/+79109535855'
WA='https://wa.me/79109535855'
def soup(s):return BeautifulSoup(s,'html.parser')
def contacts(s):
 for group in s.select('.contact-four'):
  for a in group.select('a'):
   if 't.me/' in a.get('href',''):a['href']=TG
   if 'vk.com/' in a.get('href',''):
    a['href']=WA;a['aria-label']='Написать в WhatsApp';a['title']='WhatsApp'
    a.clear();a.append(soup('<img src="/brand/whatsapp-original-20261029.svg" alt="" width="24" height="24"/>').img)
 for a in s.select('a[href]'):
  if 't.me/gostevoidom44' in a['href']:a['href']=TG

closing={
 'dlya-bolshoy-kompanii':('.rs-company-closing','Напишите нам планируемые даты поездки и количество человек'),
 'dlya-komandirovochnyh':('.rs-business-closing',None),
 'vse-dlya-otdyha/zavtraki':('.rs-breakfast-closing','Будем рады помочь!'),
 'vse-dlya-otdyha/banya-i-kupel':('#bath-booking',None),
 'vse-dlya-otdyha/s-detmi':('.children-request','Сообщите при бронировании или в мессенджере, что понадобится ребёнку, — мы всё подготовим к вашему приезду'),
 'vse-dlya-otdyha/s-pitomcami':('#pets-booking',None),
}
for key,e in entries.items():
 d=e['data']
 if not d.get('body'):continue
 s=soup(d['body']);changed=False
 if s.select('.contact-four') or 't.me/gostevoidom44' in d['body']:contacts(s);changed=True
 if key in closing:
  sel,paragraph=closing[key];old=s.select_one(sel);assert old,key
  h=old.find('h2');assert h
  c=old.select_one('.contact-four');assert c
  text=paragraph or old.find('p').get_text(' ',strip=True)
  text=text.replace(' Выберите удобный способ связи.','')
  block=s.new_tag('section',attrs={'class':'client-contact-bar','id':old.get('id',key.split('/')[-1]+'-contact')})
  body=s.new_tag('div',attrs={'class':'client-contact-copy'});body.append(h.extract())
  para=s.new_tag('p');para.string=text;body.append(para);block.append(body)
  right=s.new_tag('div',attrs={'class':'client-contact-actions'});label=s.new_tag('p');label.string='Выберите удобный способ связи';right.append(label);right.append(c.extract());block.append(right)
  old.replace_with(block);changed=True
 if key=='vse-dlya-otdyha':
  node=s.select_one('.rs-services-closing');assert node;node.decompose();changed=True
 if key.startswith('doma/'):
  node=s.select_one('.hr-closing');assert node;node.decompose();changed=True
 if key=='vse-dlya-otdyha/mangalnaya-zona':
  im=s.select_one('.oct-kit-photo');assert im
  im['src']='/media/client-20261029/barbecue-kit.webp';im['width']='1400';im['height']='1120';im['loading']='lazy';changed=True
 if key=='vse-dlya-otdyha/banya-i-kupel':
  card=s.select_one('.client-bath-card');assert card
  head=card.select_one('.bath-option-head');head.h2.decompose()
  main=card.select_one('.client-bath-main').extract()
  secondary=card.select_one('[data-bath-index="1"]').extract()
  included=card.select_one('.oct-list').parent.extract()
  note=card.select_one('.bath-preparation-note').extract()
  media=s.new_tag('div',attrs={'class':'client-bath-media'});media.append(main)
  thumbs=s.new_tag('div',attrs={'class':'client-bath-thumbs'});thumbs.append(secondary)
  for i,name,label in [(2,'bath-accessories','Банные принадлежности'),(3,'bath-tea','Чайный стол')]:
   thumbs.append(soup(f'<button type="button" class="client-bath-photo" data-bath-index="{i}" aria-label="Открыть фото: {label}"><img src="/media/client-20261029/{name}.webp" alt="{label}" width="1200" height="900" loading="lazy"/><span>{label}</span></button>').button)
  media.append(thumbs)
  details=s.new_tag('div',attrs={'class':'client-bath-details'});details.append(head.extract());details.append(included);details.append(note)
  card.clear();card['class']=['client-bath-card','client-bath-redesign'];card.append(media);card.append(details);changed=True
 if key=='site-footer':
  intro=s.select_one('.site-footer-intro');assert intro
  intro.append(soup('<nav class="footer-social-links" aria-label="Мы в социальных сетях"><a href="https://t.me/+79109535855" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><img src="/brand/telegram-official-20261003.svg" alt="" width="28" height="28"/></a><a href="https://vk.com/gostevoidom44" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте"><img src="/brand/vk-official-20261004.svg" alt="" width="28" height="28"/></a><a href="https://ok.ru/group/70000044385070" target="_blank" rel="noopener noreferrer" aria-label="Одноклассники"><img src="/brand/ok-original-20261029.svg" alt="" width="28" height="28"/></a></nav>').nav);changed=True
 if changed:d['body']=str(s)

for f in entries['site-settings']['data']['fields']:
 if f['key']=='telegram':f['value']=TG

# Change gallery captions only, never bedroom capacity descriptions.
for key in ['lime','lemon','citrus']:
 for image in entries[key]['data']['images']:
  old=image.get('alt','');src=image.get('src','')
  new=old
  if 'twin' in src:new='Спальня с двумя кроватями'
  elif 'bedroom-window' in src:new='Спальня с двуспальной кроватью'
  elif 'bedroom-wide' in src and key=='lemon':new='Спальня с двуспальной кроватью'
  elif any(t in src for t in ['kitchen-detail','kitchen-sofa','kitchen-wide']):new='Обеденная зона'
  elif 'living' in src:new='Гостиная'
  image['alt']=new

# Optimized public copies retain the originals for full rollback.
image_map=json.loads((p/'image-map.json').read_text('utf8')) if (p/'image-map.json').exists() else {}
def optimize(value):
 if isinstance(value,str):
  for old,new in image_map.items():value=value.replace(old,new)
  return value
 if isinstance(value,list):return [optimize(x)for x in value]
 if isinstance(value,dict):return {k:optimize(v)for k,v in value.items()}
 return value
for e in after['entries']:e['data']=optimize(e['data'])
# Leaf changes can be applied independently to published and draft, with exact guards.
def diff(a,b,path=[]):
 if a==b:return []
 if isinstance(a,dict) and isinstance(b,dict) and a.keys()==b.keys():
  return [x for k in a for x in diff(a[k],b[k],path+[k])]
 if isinstance(a,list) and isinstance(b,list) and len(a)==len(b):
  return [x for i in range(len(a))for x in diff(a[i],b[i],path+[i])]
 return [{'path':path,'before':a,'after':b}]
edits=[]
for a,b in zip(before['entries'],after['entries']):
 changes=diff(a['data'],b['data'])
 if changes:edits.append({'key':a['key'],'kind':a['kind'],'changes':changes})
(p/'content-patch.json').write_text(json.dumps({'edits':edits},ensure_ascii=False,indent=2),'utf8')
(p/'after.json').write_text(json.dumps(after,ensure_ascii=False,separators=(',',':')),'utf8')
print(json.dumps({'entries':len(edits),'keys':[e['key']for e in edits]},ensure_ascii=False))
