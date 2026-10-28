from pathlib import Path
import base64,io,json,subprocess,sys
from PIL import Image,ImageStat
sys.stdout.reconfigure(encoding='utf8')
ROOT=Path(__file__).resolve().parent
CLI='C:/Users/della/AppData/Local/Programs/orca/resources/bin/orca.exe'
PAGE=(ROOT/'.qa/page-id.txt').read_text(encoding='utf8').strip()
def call(command,*args):
 r=subprocess.run([CLI,command,'--page',PAGE,*args,'--json'],capture_output=True,text=True,encoding='utf8')
 data=json.loads(r.stdout)
 assert data.get('ok'),data.get('error')
 return data['result']
def evaluate(js):
 r=call('eval','--expression',js)['result']
 try:return json.loads(r)
 except (TypeError,json.JSONDecodeError):return r
METRICS="""(() => {
 const box=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y,width:r.width,height:r.height,display:s.display,columns:s.gridTemplateColumns,padding:s.padding,gap:s.gap,fontSize:s.fontSize}};
 const n=document.querySelector('#documents-and-contacts');
 return {url:location.href,viewport:{width:innerWidth,height:innerHeight},section:box(n),heading:box(n.firstElementChild),columns:box(n.querySelector('.compact-legal-columns')),address:box(n.querySelector('address')),links:box(n.querySelector('.site-legal-links')),firstLink:box(n.querySelector('.site-legal-links a')),note:box(n.querySelector('.fl-legal-note')),documentLinks:[...n.querySelectorAll('.site-legal-links a')].map(a=>({href:a.getAttribute('href'),text:a.textContent,...box(a)})),overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)};
})()"""
def capture(label,width,height=900):
 call('exec','--command',f'set viewport {width} {height}')
 call('snapshot')
 evaluate("document.querySelector('#documents-and-contacts').scrollIntoView({block:'center',behavior:'instant'})")
 call('snapshot')
 value=evaluate(METRICS)
 qa=ROOT/'.qa';qa.mkdir(exist_ok=True)
 for attempt in range(3):
  shot=call('screenshot','--format','png');blob=base64.b64decode(shot['data'])
  if max(ImageStat.Stat(Image.open(io.BytesIO(blob))).stddev)>8:break
  call('snapshot')
 else:raise AssertionError('Screenshot contains no painted page content')
 (qa/f'{label}-{width}.png').write_bytes(blob)
 return value
if __name__=='__main__':
 label=sys.argv[1];widths=[int(x)for x in sys.argv[2:]]or[1366]
 data=[capture(label,w)for w in widths]
 (ROOT/(label+'-metrics.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
 print(json.dumps([{'width':x['viewport']['width'],'sectionHeight':x['section']['height'],'sectionWidth':x['section']['width'],'linksWidth':x['links']['width'],'columns':x['section']['columns'],'overflow':x['overflow']}for x in data]))
