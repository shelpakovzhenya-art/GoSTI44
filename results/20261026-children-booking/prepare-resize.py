from pathlib import Path
import hashlib,json,urllib.request
p=Path(__file__).resolve().parent
q=p/'resize-fix';q.mkdir(exist_ok=True)
previous=json.loads((p/'runtime-expected.json').read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
assets=[('1iyslc2xp3jm8-horizontal-v2-20261026.js','1iyslc2xp3jm8-horizontal-v3-20261026.js'),('3cltmr-horizontal-v2-20261026.js','3cltmr-horizontal-v3-20261026.js')]
guards=[];additions=[];replacements=[]
for old,new in assets:
 rel='.next/static/chunks/'+old;blob=(p/'payload'/rel).read_bytes()
 assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+old).read()==blob
 text=blob.decode();assert text.count('mounting=true;')==1
 text=text.replace('mounting=true;','mounting=true;bookingLayout=host.clientWidth<700?"vertical":"horizontal";')
 newrel='.next/static/chunks/'+new;dest=q/'payload'/newrel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text,encoding='utf8')
 guards.append({'path':rel,'sha256':sha(blob)});additions.append({'path':newrel,'sha256':sha(dest.read_bytes())})
for route in ['page','[...slug]/page','preview/page','editor-preview/page','_not-found/page']:
 rel='.next/server/app/'+route+'_client-reference-manifest.js';old=(p/'payload'/rel).read_bytes();new=old
 for a,b in assets:new=new.replace(a.encode(),b.encode())
 if old==new:continue
 dest=q/'payload'/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(new)
 replacements.append({'path':rel,'beforeSha256':sha(old),'afterSha256':sha(new)})
rows={r['path']:r for r in previous['entries']}
for item in additions+replacements:
 blob=(q/'payload'/item['path']).read_bytes();rows[item['path']]={'path':item['path'],'type':'file','bytes':len(blob),'sha256':sha(blob)}
rows=sorted(rows.values(),key=lambda r:r['path']);summary={'files':sum(r['type']=='file'for r in rows),'links':sum(r['type']=='link'for r in rows),'bytes':sum(r.get('bytes',0)for r in rows),'treeSha256':sha(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(q/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':rows},ensure_ascii=False,indent=2),encoding='utf8')
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261026-children-booking-resize','runtimeBefore':previous['summary'],'runtimeAfter':summary,'publishedAPI':sha(urllib.request.urlopen('https://tangerin.ru/api/content').read()),'guards':guards,'additions':additions,'replacements':replacements}
(q/'plan.json').write_text(json.dumps(plan,indent=2));(q/'content-patch.json').write_text('{"edits":[]}')
s=(p/'apply-production.py').read_text(encoding='utf8').replace('revision_count+4','revision_count').replace('len(before)-2','len(before)').replace("'revisionsAdded':4","'revisionsAdded':0").replace("'runtimeFilesChanged':9","'runtimeFilesChanged':"+str(len(additions)+len(replacements)))
(q/'apply-production.py').write_text(s,encoding='utf8')
print('Prepared guarded resize fix')
