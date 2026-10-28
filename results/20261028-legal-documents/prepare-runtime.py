from pathlib import Path
import hashlib,json,urllib.request
p=Path(__file__).resolve().parent;w=p/'.work';payload=w/'payload';base=p.parent.parent/'source';sha=lambda b:hashlib.sha256(b).hexdigest()
assets=[('1m2h-children-booking-design-20261026.css','1m2h-client-legal-20261028.css'),('1iyslc2xp3jm8-hydration-20261026.js','1iyslc2xp3jm8-client-legal-20261028.js')]
additions=[];replacements=[];guards=[]
for old,new in assets:
 blob=(base/'runtime/.next/static/chunks'/old).read_bytes();assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+old).read()==blob
 if old.endswith('.css'):out=blob+b'\n'+(p/'changes.css').read_bytes()
 else:
  s=blob.decode();needle='(0,e.jsx)("p",{children:(0,e.jsx)(i.EditableText,{id:`field:${s.id}:description`,value:s.text})})';assert s.count(needle)==1
  s=s.replace(needle,'(0,e.jsxs)("div",{children:['+needle+',a===6?(0,e.jsx)("a",{href:"/usloviya-bronirovaniya",className:"text-link",children:"Подробнее об условиях бронирования"}):null]})');out=s.encode()
 rel='.next/static/chunks/'+new;d=payload/rel;d.parent.mkdir(parents=True,exist_ok=True);d.write_bytes(out);additions.append({'path':rel,'sha256':sha(out)});guards.append({'path':'.next/static/chunks/'+old,'sha256':sha(blob)})
rel='.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js';blob=(base/'runtime'/rel).read_bytes();s=blob.decode();needle='(0,b.jsx)("p",{children:(0,b.jsx)(c.EditableText,{id:`field:${a.id}:description`,value:a.text})})';assert s.count(needle)==1
s=s.replace(needle,'(0,b.jsxs)("div",{children:['+needle+',d===6?(0,b.jsx)("a",{href:"/usloviya-bronirovaniya",className:"text-link",children:"Подробнее об условиях бронирования"}):null]})');d=payload/rel;d.parent.mkdir(parents=True,exist_ok=True);d.write_bytes(s.encode());replacements.append({'path':rel,'beforeSha256':sha(blob),'afterSha256':sha(d.read_bytes())})
for route in ['page','[...slug]/page','preview/page','editor-preview/page','_not-found/page']:
 rel='.next/server/app/'+route+'_client-reference-manifest.js';blob=(base/'runtime'/rel).read_bytes();out=blob
 for old,new in assets:out=out.replace(old.encode(),new.encode())
 assert out!=blob;d=payload/rel;d.parent.mkdir(parents=True,exist_ok=True);d.write_bytes(out);replacements.append({'path':rel,'beforeSha256':sha(blob),'afterSha256':sha(out)})
for f in (payload/'public/documents').rglob('*.docx'):additions.append({'path':f.relative_to(payload).as_posix(),'sha256':sha(f.read_bytes())})
manifest=json.loads((base/'runtime-manifest.json').read_text(encoding='utf8'));rows={r['path']:r for r in manifest['entries']}
for item in additions+replacements:
 blob=(payload/item['path']).read_bytes();rows[item['path']]={'path':item['path'],'type':'file','bytes':len(blob),'sha256':sha(blob)}
rows=sorted(rows.values(),key=lambda r:r['path']);summary={'files':sum(r['type']=='file'for r in rows),'links':sum(r['type']=='link'for r in rows),'bytes':sum(r.get('bytes',0)for r in rows),'treeSha256':sha(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(w/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':rows},ensure_ascii=False,indent=2),encoding='utf8')
raw=urllib.request.urlopen('https://tangerin.ru/api/content').read();assert json.loads(raw)==json.loads((w/'api-before.json').read_text(encoding='utf8'))
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261028-client-legal','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(raw),'guards':guards,'additions':additions,'replacements':replacements}
(w/'plan.json').write_text(json.dumps(plan,indent=2));print('Runtime files:',len(additions)+len(replacements),'new docs:',len(additions)-2)
