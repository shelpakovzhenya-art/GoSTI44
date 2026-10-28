from pathlib import Path
import hashlib,json,urllib.request
p=Path(__file__).resolve().parent;w=p/'.work';payload=w/'payload';base=p.parent.parent/'source';sha=lambda b:hashlib.sha256(b).hexdigest()
old='1iyslc2xp3jm8-client-legal-20261028.js';new='1iyslc2xp3jm8-faq-paragraph-20261028.js'
additions=[];replacements=[];guards=[]
paths=[('.next/static/chunks/'+old,'e','i','s','a'),('.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js','b','c','a','d')]
for rel,j,c,row,index in paths:
 before=(base/'runtime'/rel).read_bytes()
 if rel.endswith(old):assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+old).read()==before
 text=before.decode()
 editable=f'(0,{j}.jsx)({c}.EditableText,{{id:`field:${{{row}.id}}:description`,value:{row}.text}})'
 link=f'(0,{j}.jsx)("a",{{href:"/usloviya-bronirovaniya",className:"text-link",children:"Подробнее об условиях бронирования"}})'
 needle=f'(0,{j}.jsxs)("div",{{children:[(0,{j}.jsx)("p",{{children:{editable}}}),{index}===6?{link}:null]}})'
 replacement=f'(0,{j}.jsxs)("p",{{children:[{editable},{index}===6?(0,{j}.jsxs)({j}.Fragment,{{children:[" ",{link}]}}):null]}})'
 assert text.count(needle)==1;after=text.replace(needle,replacement).encode()
 out=rel.replace(old,new);dest=payload/out;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(after)
 if out!=rel:additions.append({'path':out,'sha256':sha(after)});guards.append({'path':rel,'sha256':sha(before)})
 else:replacements.append({'path':rel,'beforeSha256':sha(before),'afterSha256':sha(after)})
for route in ['page','[...slug]/page','preview/page','editor-preview/page','_not-found/page']:
 rel='.next/server/app/'+route+'_client-reference-manifest.js';before=(base/'runtime'/rel).read_bytes();after=before.replace(old.encode(),new.encode())
 if before==after:continue
 dest=payload/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(after);replacements.append({'path':rel,'beforeSha256':sha(before),'afterSha256':sha(after)})
manifest=json.loads((base/'runtime-manifest.json').read_text(encoding='utf8'));rows={r['path']:r for r in manifest['entries']}
for item in additions+replacements:
 b=(payload/item['path']).read_bytes();rows[item['path']]={'path':item['path'],'type':'file','bytes':len(b),'sha256':sha(b)}
rows=sorted(rows.values(),key=lambda r:r['path']);summary={'files':sum(r['type']=='file'for r in rows),'links':sum(r['type']=='link'for r in rows),'bytes':sum(r.get('bytes',0)for r in rows),'treeSha256':sha(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(w/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':rows},ensure_ascii=False,indent=2),encoding='utf8')
api=urllib.request.urlopen('https://tangerin.ru/api/content').read()
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261028-faq-paragraph','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(api),'guards':guards,'additions':additions,'replacements':replacements}
(w/'plan.json').write_text(json.dumps(plan,indent=2));(w/'content-patch.json').write_text('{"edits":[],"creates":[]}');(w/'preview-content.json').write_bytes(api)
print('Prepared FAQ DOM fix',len(additions)+len(replacements),'runtime files, CMS unchanged')
