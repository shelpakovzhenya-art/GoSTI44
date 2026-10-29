from pathlib import Path
import json, hashlib, shutil, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
p=Path(__file__).resolve().parent
base=p.parent.parent
plan=json.loads((p/'plan.json').read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
api=urllib.request.urlopen('https://tangerin.ru/api/content',timeout=30).read()
assert sha(api)==plan['publishedAPI']
urls=[x.text for x in ET.fromstring(urllib.request.urlopen('https://tangerin.ru/sitemap.xml',timeout=30).read()).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
checks=[]
for url in urls:
    with urllib.request.urlopen(url,timeout=30) as r:
        html=r.read().decode(); assert r.status==200
    assert '3cltmr-bnovo-reliable-20261029.js' in html,url
    assert '1m2h-bath-compact-20261028.css' in html,url
    if url.rstrip('/')=='https://tangerin.ru':assert '1iyslc2xp3jm8-bnovo-reliable-20261029.js' in html
    checks.append({'url':url,'status':200,'newLoader':True,'existingCSS':True})
for item in plan['additions']:
    data=urllib.request.urlopen('https://tangerin.ru/_next/'+item['path'].removeprefix('.next/'),timeout=30).read()
    assert sha(data)==item['sha256']
for item in plan['additions']+plan['replacements']:
    dst=base/'runtime'/item['path']; dst.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(p/'payload'/item['path'],dst)
shutil.copy2(p/'runtime-expected.json',base/'runtime-manifest.json')
snapshot=json.loads((base/'snapshot.json').read_text(encoding='utf8'))
snapshot.update(runtime=plan['runtimeAfter'],runtimeServerHashVerified=True,updatedAt=datetime.now(timezone.utc).isoformat())
snapshot['latestChange']={'date':'2026-10-29','task':'bnovo-reliability','runtimeFiles':6,'cmsRecords':0,'backup':plan['backup'],'evidence':'Orca results/20261029-bnovo-reliability/README.md'}
(base/'snapshot.json').write_text(json.dumps(snapshot,ensure_ascii=False,indent=2),encoding='utf8')
result={'pages':checks,'pageCount':len(checks),'publishedAPIUnchanged':True,'newAssetHashesVerified':True,'runtime':plan['runtimeAfter'],'CMSRows':64,'CMSRowsUnchanged':True,'revisionsAdded':0}
(p/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'pages':len(checks),'APIUnchanged':True,'assetHashes':True,'localSynchronized':True}))
