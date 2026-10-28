from pathlib import Path
import copy,hashlib,json,shutil,urllib.request
p=Path(__file__).resolve().parent;w=p/'.work';payload=w/'payload';base=p.parent.parent/'source';sha=lambda b:hashlib.sha256(b).hexdigest()
raw=urllib.request.urlopen('https://tangerin.ru/api/content').read();api=json.loads(raw);entries={e['key']:e for e in api['entries']}
replacements=[];edits=[]
for f in (w/'documents').glob('*.docx'):
 rel='public/documents/20261028/'+f.name;before=(base/'runtime'/rel).read_bytes();assert urllib.request.urlopen('https://tangerin.ru/'+rel.removeprefix('public/')).read()==before
 d=payload/rel;d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);replacements.append({'path':rel,'beforeSha256':sha(before),'afterSha256':sha(f.read_bytes())})
assert len(replacements)==3
for slug in ['usloviya-bronirovaniya','soglasie-na-obrabotku-personalnyh-dannyh','pravila-prozhivaniya','politika-obrabotki-personalnyh-dannyh','dogovor-oferta']:
 before=entries[slug]['data'];after=copy.deepcopy(before);assert after['body'].count('Скачать исходный документ DOCX')==1;after['body']=after['body'].replace('Скачать исходный документ DOCX','Скачать документ DOCX')
 if slug=='dogovor-oferta':
  needle='Контактные данные указаны в разделе 15.';assert after['body'].count(needle)==1;after['body']=after['body'].replace(needle,'Контактные данные опубликованы на сайте tangerin.ru.')
 edits.append({'key':slug,'kind':'page','before':before,'after':after})
(w/'content-patch.json').write_text(json.dumps({'edits':edits,'creates':[]},ensure_ascii=False,indent=2),encoding='utf8')
manifest=json.loads((base/'runtime-manifest.json').read_text(encoding='utf8'));rows={r['path']:r for r in manifest['entries']}
for x in replacements:
 b=(payload/x['path']).read_bytes();rows[x['path']]={'path':x['path'],'type':'file','bytes':len(b),'sha256':sha(b)}
rows=sorted(rows.values(),key=lambda r:r['path']);summary={'files':sum(r['type']=='file'for r in rows),'links':sum(r['type']=='link'for r in rows),'bytes':sum(r.get('bytes',0)for r in rows),'treeSha256':sha(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(w/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':rows},ensure_ascii=False,indent=2),encoding='utf8')
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261028-document-parity','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(raw),'guards':[],'additions':[],'replacements':replacements}
(w/'plan.json').write_text(json.dumps(plan,indent=2));shutil.copy2(p.parent/'20261028-legal-documents/apply-production.py',p/'apply-production.py')
print('Prepared3 corrected downloads and5 page links, including1 broken reference correction')
