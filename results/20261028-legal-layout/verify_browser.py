from pathlib import Path
import json
import browser_qa as q

p=Path(__file__).resolve().parent
q.call('reload');q.call('snapshot')
q.evaluate('document.fonts.ready.then(()=>true)')
assert q.evaluate("document.getElementById('legal-layout-preview') === null")
assert q.evaluate("[...document.querySelectorAll('link[rel=stylesheet]')].some(e=>e.href.includes('1m2h-legal-layout-20261028.css'))")
data=[]
for width in [1920,1366,1024,768,390,320]:
 x=q.capture('production',width)
 assert x['overflow']==0 and x['section']['display']=='block'
 assert abs(x['section']['width']-x['columns']['width'])<1
 assert abs(x['section']['x']-x['heading']['x'])<1
 assert len(x['documentLinks'])==6
 if width>=768:
  assert x['links']['width']>=350
  assert x['firstLink']['width']>=180
  assert x['section']['height']<=250
 else:
  assert abs(x['links']['width']-x['columns']['width'])<1
  assert len({round(a['x'])for a in x['documentLinks']})==1
 for a in x['documentLinks']:
  assert a['width']>0 and a['height']>0
  assert a['x']>=x['section']['x']-1
  assert a['x']+a['width']<=x['section']['x']+x['section']['width']+1
  assert a['y']+a['height']<=x['section']['y']+x['section']['height']+1
 data.append(x)

snapshot=q.call('snapshot')
cookie=next(k for k,v in snapshot['refs'].items()if v.get('role')=='link'and v.get('name')=='Настройка cookies')
q.call('click','--element','@'+cookie);snapshot=q.call('snapshot')
assert any(v.get('name')=='Настройки cookies'for v in snapshot['refs'].values())
close=next(k for k,v in snapshot['refs'].items()if v.get('role')=='button'and 'Закрыть'in v.get('name',''))
q.call('click','--element','@'+close);q.call('snapshot')

snapshot=q.call('snapshot')
rules=next(k for k,v in snapshot['refs'].items()if v.get('role')=='link'and v.get('name')=='Правила проживания')
q.call('click','--element','@'+rules);q.call('wait','--url','/pravila-prozhivaniya');q.call('snapshot')
assert q.evaluate("location.pathname === '/pravila-prozhivaniya'")
page=q.capture('rules-production',1366)
assert page['section']['display']=='block'and page['links']['width']>=600
q.call('back');q.call('snapshot')
assert q.evaluate("location.pathname === '/'")
back=q.capture('home-return-production',390)
assert back['section']['display']=='block'and back['overflow']==0
console=q.call('console','--limit','50')
(p/'.qa/console.json').write_text(json.dumps(console,ensure_ascii=False,indent=2),encoding='utf8')
out={'browser':'Orca embedded browser via supported CLI','previewStyleRemoved':True,'liveStylesheet':'1m2h-legal-layout-20261028.css','home':data,'rulesPage':page,'spaReturn':back,'cookieSettingsOpenedAndClosed':True,'rulesLinkNavigated':True,'overflowAllWidths':0}
(p/'production-metrics.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'widths':[x['viewport']['width']for x in data],'heights':[x['section']['height']for x in data],'cookies':True,'rulesLink':True,'spaReturn':True,'consoleResultKeys':list(console)if isinstance(console,dict)else type(console).__name__}))
