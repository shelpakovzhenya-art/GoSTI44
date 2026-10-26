from pathlib import Path
import hashlib,json,urllib.request
p=Path(__file__).resolve().parent;base=p.parent.parent/'source';payload=p/'payload'
sha=lambda b:hashlib.sha256(b).hexdigest()
assets=[('3cltmr-children-booking-design-20261026.js','3cltmr-hydration-20261026.js'),('1iyslc2xp3jm8-horizontal-v3-20261026.js','1iyslc2xp3jm8-hydration-20261026.js')]
guards=[];additions=[];replacements=[]
for old,new in assets:
 rel='.next/static/chunks/'+old;blob=(base/'runtime'/rel).read_bytes()
 assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+old).read()==blob
 s=blob.decode()
 if old.startswith('3cltmr'):
  needle="document.querySelectorAll('[data-tangerin-frame-src]').forEach(host => {"
  assert s.count(needle)==1
  s=s.replace(needle,needle+'\n      // React owns these children until the host ref commits.\n      if(host.hasAttribute("data-tangerin-react-embed") && host.dataset.tangerinHydrated!=="true")return;')
  needle='  function syncEmbeds() {';assert s.count(needle)==1
  s=s.replace(needle,'  document.addEventListener("tangerin:embeds-ready",syncEmbeds);\n'+needle)
 else:
  needle='className:"tangerin-external-embed",';assert s.count(needle)==2
  s=s.replace(needle,needle+'"data-tangerin-react-embed":"true",ref:tangerinEmbedCommitted,')
  needle='function F(){';assert s.count(needle)==1
  helper='function tangerinEmbedCommitted(host){if(!host)return;queueMicrotask(()=>{if(!host.isConnected)return;host.dataset.tangerinHydrated="true";document.dispatchEvent(new Event("tangerin:embeds-ready"));});}'
  s=s.replace(needle,helper+needle)
 relnew='.next/static/chunks/'+new;dest=payload/relnew;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(s.encode())
 guards.append({'path':rel,'sha256':sha(blob)});additions.append({'path':relnew,'sha256':sha(dest.read_bytes())})
rel='.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js';before=(base/'runtime'/rel).read_bytes()
needle=b'className:"tangerin-external-embed",';assert before.count(needle)==2
after=before.replace(needle,needle+b'"data-tangerin-react-embed":"true",')
dest=payload/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(after)
replacements.append({'path':rel,'beforeSha256':sha(before),'afterSha256':sha(after)})
for route in ['page','[...slug]/page','preview/page','editor-preview/page','_not-found/page']:
 rel='.next/server/app/'+route+'_client-reference-manifest.js';before=(base/'runtime'/rel).read_bytes();after=before
 for old,new in assets:after=after.replace(old.encode(),new.encode())
 if after==before:continue
 dest=payload/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(after)
 replacements.append({'path':rel,'beforeSha256':sha(before),'afterSha256':sha(after)})
manifest=json.loads((base/'runtime-manifest.json').read_text(encoding='utf8'));rows={r['path']:r for r in manifest['entries']}
for item in additions+replacements:
 b=(payload/item['path']).read_bytes();rows[item['path']]={'path':item['path'],'type':'file','bytes':len(b),'sha256':sha(b)}
rows=sorted(rows.values(),key=lambda r:r['path']);summary={'files':sum(r['type']=='file'for r in rows),'links':sum(r['type']=='link'for r in rows),'bytes':sum(r.get('bytes',0)for r in rows),'treeSha256':sha(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(p/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':rows},ensure_ascii=False,indent=2),encoding='utf8')
raw=urllib.request.urlopen('https://tangerin.ru/api/content').read()
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261026-react-hydration','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(raw),'guards':guards,'additions':additions,'replacements':replacements}
(p/'plan.json').write_text(json.dumps(plan,indent=2));(p/'content-patch.json').write_text('{"edits":[]}')
(p/'preview-content.json').write_bytes(raw)
s=(p.parent/'20261026-children-booking-design/apply-production.py').read_text(encoding='utf8').replace("'runtimeFilesChanged':7","'runtimeFilesChanged':"+str(len(additions)+len(replacements)))
(p/'apply-production.py').write_text(s,encoding='utf8')
print('Prepared guarded embed lifecycle fix:',len(additions)+len(replacements),'files')
