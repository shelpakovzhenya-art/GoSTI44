from pathlib import Path
import copy,hashlib,json,re,urllib.request,xml.etree.ElementTree as ET
p=Path(__file__).resolve().parent
raw=urllib.request.urlopen('https://tangerin.ru/api/content').read();api=json.loads(raw);entries={e['key']:e for e in api['entries']}
spec=json.loads((p/'content-patch.json').read_text(encoding='utf8'))
for edit in spec['edits']:
 expected=copy.deepcopy(edit['beforePublished'])
 for t in edit['transforms']:expected['body']=expected['body'].replace(t['before'],t['after'])
 assert entries[edit['key']]['data']==expected
home=urllib.request.urlopen('https://tangerin.ru/').read().decode()
assert home.count('id="booking-top"')==1 and home.count('id="_bn_widget_top_"')==1 and home.count('id="_bn_widget_"')==1
assert home.index('id="booking-top"')<home.index('id="home-benefits"')
child=urllib.request.urlopen('https://tangerin.ru/vse-dlya-otdyha/s-detmi').read().decode()
assert 'children-request' in child and 'Соберём и подготовим кроватку' in child
assert 'site-footer-social-icon' not in home and 'site-footer-phone' not in home
assert 'https://www.avito.ru/brands/i88220667' in home
assets=[]
for folder in [p,p/'resize-fix']:
 plan=json.loads((folder/'plan.json').read_text())
 for item in plan['additions']:
  if not item['path'].startswith('.next/static/'):continue
  url='https://tangerin.ru/_next/'+item['path'][len('.next/'):]
  blob=urllib.request.urlopen(url).read();assert hashlib.sha256(blob).hexdigest()==item['sha256'];assets.append(url)
root=ET.fromstring(urllib.request.urlopen('https://tangerin.ru/sitemap.xml').read())
urls=[e.text for e in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
statuses=[{'url':url,'status':urllib.request.urlopen(url).status}for url in urls]
assert len(statuses)==23 and all(x['status']==200 for x in statuses)
result={'apiSha256':hashlib.sha256(raw).hexdigest(),'changedBodiesVerified':[x['key']for x in spec['edits']],'topBookingBeforeBenefits':True,'uniqueHomeWidgetHosts':True,'footerContactRepeatsRemoved':True,'avitoPreserved':True,'assetsVerified':assets,'pages':statuses}
(p/'public-verification.json').write_text(json.dumps(result,indent=2),encoding='utf8')
print(json.dumps({'http200Pages':len(statuses),'assetsVerified':len(assets),'cmsBodiesVerified':2,'topWidgetPositionVerified':True}))
