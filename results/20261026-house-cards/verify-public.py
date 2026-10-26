from pathlib import Path
from html.parser import HTMLParser
import copy, hashlib, json, urllib.request, xml.etree.ElementTree as ET

p=Path(__file__).resolve().parent
raw=urllib.request.urlopen('https://tangerin.ru/api/content').read()
entries={e['key']:e for e in json.loads(raw)['entries']}
spec=json.loads((p/'content-patch.json').read_text(encoding='utf-8'))
for edit in spec['edits']:
    expected=copy.deepcopy(edit['beforePublished'])
    expected['body']=expected['body'].replace(edit['before'],edit['after'])
    assert entries[edit['key']]['data']==expected
class Comparison(HTMLParser):
    def __init__(self):super().__init__();self.active=False;self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='section' and a.get('id')=='house-compare':self.active=True
        if self.active and tag=='a' and 'hr-compare-card' in a.get('class',''):self.links.append(a['href'])
    def handle_endtag(self,tag):
        if tag=='section':self.active=False
checks=[]
for edit in spec['edits']:
    route='/'+edit['key'];r=urllib.request.urlopen('https://tangerin.ru'+route);h=r.read().decode()
    parser=Comparison();parser.feed(h)
    assert len(parser.links)==2 and route not in parser.links
    assert '1m2h-house-cards-20261026.css' in h
    checks.append({'route':route,'status':r.status,'comparisonLinks':parser.links})
root=ET.fromstring(urllib.request.urlopen('https://tangerin.ru/sitemap.xml').read())
urls=[e.text for e in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
statuses=[{'url':url,'status':urllib.request.urlopen(url).status} for url in urls]
assert len(statuses)==23 and all(x['status']==200 for x in statuses)
css=urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/1m2h-house-cards-20261026.css').read()
assert css==(p/'payload/.next/static/chunks/1m2h-house-cards-20261026.css').read_bytes()
result={'apiSha256':hashlib.sha256(raw).hexdigest(),'housePages':checks,'sitemapPages':statuses,'cssMatchesPayload':True}
(p/'public-verification.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps({'housePages':checks,'http200Pages':len(statuses),'cssMatchesPayload':True}))
