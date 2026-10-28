from pathlib import Path
import concurrent.futures,hashlib,json,urllib.request,xml.etree.ElementTree as E
from bs4 import BeautifulSoup
p=Path(__file__).resolve().parent;plan=json.loads((p/'.work/plan.json').read_text())
fetch=lambda u:urllib.request.urlopen(u,timeout=30).read()
assert hashlib.sha256(fetch('https://tangerin.ru/api/content')).hexdigest()==plan['publishedAPI']
css='/_next/static/chunks/1m2h-legal-layout-20261028.css'
assert fetch('https://tangerin.ru'+css)==(p/'.work/payload/.next/static/chunks/1m2h-legal-layout-20261028.css').read_bytes()
required={'/usloviya-bronirovaniya','/soglasie-na-obrabotku-personalnyh-dannyh','/politika-obrabotki-personalnyh-dannyh','/pravila-prozhivaniya','#cookie-settings','https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a'}
urls=[x.text for x in E.fromstring(fetch('https://tangerin.ru/sitemap.xml')).findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];assert len(urls)==25
def check(url):
 s=BeautifulSoup(fetch(url),'html.parser');f=s.select_one('#documents-and-contacts')
 assert len(s.select('h1'))==1
 assert css in [x['href']for x in s.select('link[rel=stylesheet]')]
 assert {x['href']for x in f.select('.site-legal-links a')}==required and len(f.select('.site-legal-links a'))==6
 assert f.select_one('a[href="tel:+79109535855"]')and f.select_one('a[href="mailto:sudja2000@list.ru"]')
 return {'url':url,'http':200,'newCSS':True,'legalLinks':6}
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as ex:rows=list(ex.map(check,urls))
(p/'http-checks.json').write_text(json.dumps({'apiUnchanged':True,'cssSha256Verified':True,'pages':rows},ensure_ascii=False,indent=2),encoding='utf8')
print('25 pages HTTP200, new CSS and6 legal links; live CSS SHA verified; CMS API unchanged')
