from pathlib import Path
import json,sys
import browser_qa as q
p=Path(__file__).resolve().parent
q.call('reload');q.call('snapshot')
assert q.evaluate("document.getElementById('bath-compact-preview')===null")
assert q.evaluate("[...document.querySelectorAll('link[rel=stylesheet]')].some(e=>e.href.includes('1m2h-bath-compact-20261028.css'))")
data=json.loads((p/'production-layout-metrics.json').read_text(encoding='utf8'))if'--controls-only'in sys.argv else []
for width in([]if data else[1920,1366,1024,768,390,320]):
 x=q.capture('production',width)
 assert x['viewport']['width']==width and x['overflow']==0
 assert x['topBack']['display']=='none'and x['priceHead']['minHeight']=='0px'
 assert x['card']['height']<(430 if width>700 else 650)
 assert x['photo']['y']<(360 if width>700 else 430)
 assert len(x['photos'])==2 and all(a['ready']for a in x['photos'])
 assert x['photos'][0]['src']=='/images/lime-sauna-20261002.webp'
 assert x['photos'][1]['src']=='/media/client-revisions-20261014/bath-relax.webp'
 assert len(x['contactLinks'])==4
 assert len(x['fields'])==4 and all(a['width']>0 for a in x['fields'])
 if width>=1024:assert len({round(a['y'])for a in x['fields']})==1
 if width<=700:assert len({round(a['y'])for a in x['fields']})==4
 data.append(x)
(p/'production-layout-metrics.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')

def ref(role,name):
 s=q.call('snapshot')
 return next(k for k,v in s['refs'].items()if v.get('role')==role and v.get('name')==name)
photos=[]
for name in['Открыть фото: Парная','Открыть фото: Зона отдыха']:
 q.call('click','--element','@'+ref('button',name));q.call('snapshot')
 src=q.evaluate("document.querySelector('dialog[open] img')?.getAttribute('src')")
 assert src, name
 photos.append(src)
 q.call('keypress','--key','Escape');q.call('snapshot')
 assert q.evaluate("document.querySelector('dialog[open]')===null")
assert [x.removeprefix('https://tangerin.ru')for x in photos]==[x['src']for x in data[0]['photos']]

controls=[]
for width in[1366,390]:
 q.call('exec','--command',f'set viewport {width} 900');q.call('reload');q.call('snapshot')
 x=q.capture('controls',width)
 q.evaluate("document.querySelector('#footer-booking').scrollIntoView({block:'center',behavior:'instant'})");q.call('snapshot')
 s=q.call('snapshot');inputs=sorted([(int(k[1:]),k)for k,v in s['refs'].items()if v.get('role')=='textbox'])
 assert len(inputs)==3
 q.call('click','--element','@'+inputs[0][1]);q.call('snapshot')
 cal=q.evaluate("""(()=>{const f=document.querySelector('#_bn_iframe__bn_widget_footer_'),d=f.contentDocument,e=d.querySelector('#ui-datepicker-div'),r=e.getBoundingClientRect();return{visible:d.defaultView.getComputedStyle(e).display!=='none',width:r.width,height:r.height,bottom:r.bottom,frameHeight:f.clientHeight,frameWidth:f.clientWidth}})()""")
 assert cal['visible']and cal['height']>0 and cal['bottom']<=cal['frameHeight']+1 and cal['width']<=cal['frameWidth']+1
 q.shot(f'calendar-{width}.png');q.call('keypress','--key','Escape');q.call('snapshot')
 s=q.call('snapshot');inputs=sorted([(int(k[1:]),k)for k,v in s['refs'].items()if v.get('role')=='textbox'])
 q.call('click','--element','@'+inputs[2][1]);q.call('snapshot')
 guests=q.evaluate("""(()=>{const f=document.querySelector('#_bn_iframe__bn_widget_footer_'),d=f.contentDocument,e=d.querySelector('.bnovo__guests'),r=e.getBoundingClientRect();return{visible:d.defaultView.getComputedStyle(e).display!=='none',width:r.width,height:r.height,bottom:r.bottom,frameHeight:f.clientHeight,frameWidth:f.clientWidth}})()""")
 assert guests['visible']and guests['height']>0 and guests['bottom']<=guests['frameHeight']+1 and guests['width']<=guests['frameWidth']+1
 q.shot(f'guests-{width}.png')
 q.call('click','--element','@'+ref('heading','Проверьте свободные даты и стоимость'));q.call('snapshot')
 controls.append({'width':width,'calendar':cal,'guests':guests,'bookingSubmitted':False})

q.call('click','--element','@'+ref('link','Всё для вашего отдыха'));q.call('snapshot')
assert q.evaluate("location.pathname==='/vse-dlya-otdyha'")
other=q.evaluate("({bathMarker:!!document.querySelector('#sc-uniform-copy-bath'),legalDisplay:getComputedStyle(document.querySelector('#documents-and-contacts')).display})")
assert not other['bathMarker']and other['legalDisplay']=='block'
q.call('click','--element','@'+ref('link','Баня'));q.call('snapshot')
assert q.evaluate("location.pathname==='/vse-dlya-otdyha/banya-i-kupel'")
returned=q.capture('spa-return',390);assert len(returned['fields'])==4 and returned['overflow']==0
console=q.call('console','--limit','50')
(p/'.qa/console.json').write_text(json.dumps(console,ensure_ascii=False,indent=2),encoding='utf8')
out={'browser':'Orca built-in browser via supported CLI','previewRemoved':True,'bathWidths':data,'photoDialogs':photos,'bookingControls':controls,'overview':other,'spaReturn':returned,'consoleMessages':console,'bookingSubmitted':False}
(p/'production-metrics.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'widths':[x['viewport']['width']for x in data],'mainHeights':[x['main']['height']for x in data],'photos':2,'calendarAndGuests':[1366,390],'spa':True,'console':console}))
