from pathlib import Path
import urllib.request,json,concurrent.futures,hashlib
from bs4 import BeautifulSoup
p=Path(__file__).resolve().parent
data=json.loads((p/'published-after.json').read_text('utf8'))
urls=['https://tangerin.ru/']+['https://tangerin.ru/'+e['key']for e in data['entries']if e['kind']=='page' and e['key']!='home']
def check(u):
 r=urllib.request.urlopen(u,timeout=30);s=BeautifulSoup(r.read(),'html.parser');can=s.select_one('link[rel=canonical]');desc=s.select_one('meta[name=description]')
 out={'url':u,'status':r.status,'h1':len(s.select('h1')),'title':s.title.get_text()if s.title else None,'description':bool(desc and desc.get('content')),'canonical':can.get('href')if can else None,'schema':len(s.select('script[type="application/ld+json"]')),'newCSS':bool(s.select('link[href*="1m2h-client-letter-v7-20261029"]')),'booking':bool(s.select('#_bn_widget_footer_')),'ok':bool(s.select('a[href="https://ok.ru/group/70000044385070"]'))}
 assert out['status']==200 and out['h1']==1 and out['title'] and out['description'] and out['canonical'].rstrip('/')==u.rstrip('/') and out['newCSS'] and out['ok'],out
 return out
with concurrent.futures.ThreadPoolExecutor(max_workers=5)as ex:rows=list(ex.map(check,urls))
headers=dict(urllib.request.urlopen('https://tangerin.ru/').headers)
request=urllib.request.Request('https://tangerin.ru/csp-report',data=json.dumps({'csp-report':{'effective-directive':'script-src-elem','blocked-uri':'https://example.invalid/path?redacted=test'}}).encode(),headers={'Content-Type':'application/csp-report'})
r=urllib.request.urlopen(request,timeout=20);assert r.status==204
assets=[]
for item in json.loads((p/'plan.json').read_text())['additions']:
 rel=item['path'];url='https://tangerin.ru/'+(rel[len('public/'):]if rel.startswith('public/')else rel.replace('.next/static/','_next/static/',1));blob=urllib.request.urlopen(url,timeout=20).read();assert hashlib.sha256(blob).hexdigest()==item['sha256'];assets.append(url)
robots=urllib.request.urlopen('https://tangerin.ru/robots.txt').read().decode();sitemap=urllib.request.urlopen('https://tangerin.ru/sitemap.xml').read().decode();llms=urllib.request.urlopen('https://tangerin.ru/llms.txt').read().decode()
assert 'Sitemap: https://tangerin.ru/sitemap.xml' in robots and all(u.rstrip('/') in sitemap for u in urls)
result={'pages':rows,'headers':headers,'assetSHAValidated':len(assets),'cspReportStatus':r.status,'robots':robots,'llmsAvailable':len(llms)>100,'sitemapAllPages':True}
(p/'production-http.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),'utf8')
print({'pages':len(rows),'assets':len(assets),'csp':r.status,'sitemap':True})



