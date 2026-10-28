from pathlib import Path
import hashlib,json,shutil,urllib.request

p=Path(__file__).resolve().parent; w=p/'.work'; payload=w/'payload'
base=p.parent.parent/'source'; sha=lambda b:hashlib.sha256(b).hexdigest()
old='1m2h-compact-legal-20261028.css'; new='1m2h-bath-closing-20261028.css'
manifest=json.loads((base/'runtime-manifest.json').read_text(encoding='utf8'))
rows={r['path']:r for r in manifest['entries']}
rel='.next/static/chunks/'+old
original=(base/'runtime'/rel).read_bytes()
assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+old).read()==original
addition='.next/static/chunks/'+new; content=original+b'\n'+(p/'bath-closing.css').read_bytes()
dst=payload/addition;dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(content)
rows[addition]={'path':addition,'type':'file','bytes':len(content),'sha256':sha(content)}
replacements=[]
for r in manifest['entries']:
 if not r['path'].endswith('page_client-reference-manifest.js'):continue
 f=base/'runtime'/r['path'];before=f.read_bytes()
 if old.encode()not in before:continue
 after=before.replace(old.encode(),new.encode());dst=payload/r['path'];dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(after)
 replacements.append({'path':r['path'],'beforeSha256':sha(before),'afterSha256':sha(after)})
 rows[r['path']]={'path':r['path'],'type':'file','bytes':len(after),'sha256':sha(after)}
assert len(replacements)==5
entries=sorted(rows.values(),key=lambda r:r['path'])
summary={'files':sum(r['type']=='file'for r in entries),'links':sum(r['type']=='link'for r in entries),'bytes':sum(r.get('bytes',0)for r in entries),'treeSha256':sha(json.dumps(entries,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
w.mkdir(exist_ok=True)
(w/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':entries},ensure_ascii=False,indent=2),encoding='utf8')
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261028-bath-closing-cascade','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(urllib.request.urlopen('https://tangerin.ru/api/content').read()),'guards':[],'additions':[{'path':addition,'sha256':sha(content)}],'replacements':replacements}
(w/'plan.json').write_text(json.dumps(plan,indent=2),encoding='utf8')
(w/'content-patch.json').write_text('{"edits":[],"creates":[]}',encoding='utf8')
print('Prepared scoped CSS correction and5 manifest replacements; CMS unchanged')
