from pathlib import Path
import base64,io,json,subprocess,sys
from PIL import Image,ImageStat
sys.stdout.reconfigure(encoding='utf8')
ROOT=Path(__file__).resolve().parent
CLI='C:/Users/della/AppData/Local/Programs/orca/resources/bin/orca.exe'
PAGE=(ROOT/'.qa/page-id.txt').read_text(encoding='utf8').strip()
URL='https://tangerin.ru/vse-dlya-otdyha/banya-i-kupel'
def call(command,*args):
 r=subprocess.run([CLI,command,'--page',PAGE,*args,'--json'],capture_output=True,text=True,encoding='utf8')
 d=json.loads(r.stdout);assert d.get('ok'),d.get('error');return d['result']
def evaluate(js):
 v=call('eval','--expression',js)['result']
 try:return json.loads(v)
 except(TypeError,json.JSONDecodeError):return v
METRICS="""(()=>{const b=e=>{if(!e)return null;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height,display:s.display,padding:s.padding,margin:s.margin,minHeight:s.minHeight,gridArea:s.gridArea}};const f=document.querySelector('#_bn_iframe__bn_widget_footer_'),d=f?.contentDocument;return {viewport:{width:innerWidth,height:innerHeight},main:b(document.querySelector('#main')),breadcrumb:b(document.querySelector('#sc-path-bath')),topBack:b(document.querySelector('#sc-uniform-copy-bath > .rs-services-back')),heading:b(document.querySelector('.client-bath-heading')),card:b(document.querySelector('.client-bath-card')),priceHead:b(document.querySelector('.bath-option-head')),photo:b(document.querySelector('.client-bath-main')),photoImage:b(document.querySelector('.client-bath-main img')),details:b(document.querySelector('.client-bath-bottom')),closing:b(document.querySelector('#bath-booking')),back:b(document.querySelector('.rs-back-bottom')),booking:b(document.querySelector('#footer-booking')),frame:b(f),fields:d?[...d.querySelectorAll('#from,#to,#guests_count,.openReceptionButton')].map(e=>({id:e.id,width:e.getBoundingClientRect().width,y:e.getBoundingClientRect().y,height:e.getBoundingClientRect().height})):[],mode:d?.body?.className,photos:[...document.querySelectorAll('[data-bath-index] img')].map(e=>({src:e.getAttribute('src'),ready:e.complete&&e.naturalWidth>0})),contactLinks:[...document.querySelectorAll('#bath-booking .contact-four a')].map(a=>a.getAttribute('href')),overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)}})()"""
def shot(name):
 for _ in range(3):
  data=base64.b64decode(call('screenshot','--format','png')['data'])
  if max(ImageStat.Stat(Image.open(io.BytesIO(data))).stddev)>8:break
  call('snapshot')
 else:raise AssertionError('Unpainted screenshot')
 (ROOT/'.qa'/name).write_bytes(data)
def capture(label,width):
 call('exec','--command',f'set viewport {width} 900');call('snapshot')
 evaluate('window.scrollTo({top:0,behavior:"instant"})');call('snapshot');shot(f'{label}-top-{width}.png')
 evaluate("document.querySelector('#bath-booking').scrollIntoView({block:'center',behavior:'instant'})");call('snapshot');shot(f'{label}-bottom-{width}.png')
 for _ in range(8):
  m=evaluate(METRICS)
  if len(m['fields'])==4 and all(x['width']>0 for x in m['fields']):break
  call('snapshot')
 return m
if __name__=='__main__':
 label=sys.argv[1];widths=[int(x)for x in sys.argv[2:]]or[1366]
 data=[capture(label,w)for w in widths]
 (ROOT/(label+'-metrics.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
 print(json.dumps([{'width':x['viewport']['width'],'main':x['main']['height'],'head':x['heading']['height'],'card':x['card']['height'],'photoTop':x['photo']['y'],'bookingHeight':x['booking']['height'],'form':x['mode'],'overflow':x['overflow']}for x in data]))
