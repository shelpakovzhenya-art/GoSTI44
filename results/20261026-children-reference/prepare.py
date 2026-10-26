from pathlib import Path
import hashlib,json,urllib.request
p=Path(__file__).resolve().parent;base=p.parent.parent/'source';sha=lambda b:hashlib.sha256(b).hexdigest()
raw=urllib.request.urlopen('https://tangerin.ru/api/content').read()
old='1m2h-children-booking-v3-20261026.css';new='1m2h-children-reference-20261026.css'
blob=(base/'runtime/.next/static/chunks'/old).read_bytes();assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+old).read()==blob
scope='html:root body:has(#main):has(#main):has(#main):has(#main) #main#main #additional-services#additional-services #sc-uniform-copy-children'
data=blob+b'\n'+(p/'reference.css').read_text(encoding='utf8').replace('CHILD',scope).encode()
payload=p/'payload';rel='.next/static/chunks/'+new;dest=payload/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
additions=[{'path':rel,'sha256':sha(data)}];replacements=[]
for route in ['page','[...slug]/page','preview/page','editor-preview/page','_not-found/page']:
 rel='.next/server/app/'+route+'_client-reference-manifest.js';before=(base/'runtime'/rel).read_bytes();after=before.replace(old.encode(),new.encode());assert before!=after
 dest=payload/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(after);replacements.append({'path':rel,'beforeSha256':sha(before),'afterSha256':sha(after)})
manifest=json.loads((base/'runtime-manifest.json').read_text(encoding='utf8'));rows={r['path']:r for r in manifest['entries']}
for item in additions+replacements:
 data=(payload/item['path']).read_bytes();rows[item['path']]={'path':item['path'],'type':'file','bytes':len(data),'sha256':sha(data)}
rows=sorted(rows.values(),key=lambda r:r['path']);summary={'files':sum(r['type']=='file'for r in rows),'links':sum(r['type']=='link'for r in rows),'bytes':sum(r.get('bytes',0)for r in rows),'treeSha256':sha(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(p/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':rows},ensure_ascii=False,indent=2),encoding='utf8')
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261026-children-reference','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(raw),'guards':[{'path':'.next/static/chunks/'+old,'sha256':sha(blob)}],'additions':additions,'replacements':replacements}
(p/'plan.json').write_text(json.dumps(plan,indent=2));(p/'content-patch.json').write_text('{"edits":[]}')
s=(p.parent/'20261026-children-booking/resize-fix/apply-production.py').read_text(encoding='utf8');(p/'apply-production.py').write_text(s,encoding='utf8')
print('Prepared CSS-only reference corrections; CMS unchanged')
