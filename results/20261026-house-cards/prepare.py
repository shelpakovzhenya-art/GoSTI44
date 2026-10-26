from pathlib import Path
import hashlib, json, re, urllib.request

p = Path(__file__).resolve().parent
base = p.parent.parent / 'source'
sha = lambda data: hashlib.sha256(data).hexdigest()
raw = urllib.request.urlopen('https://tangerin.ru/api/content').read()
old_name = '1m2h-contacts-type-20261023.css'
new_name = '1m2h-house-cards-20261026.css'
old_css = (base / 'runtime/.next/static/chunks' / old_name).read_bytes()
assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/' + old_name).read() == old_css
payload = p / 'payload'
new_css = old_css + b'\n' + (p / 'cards.css').read_bytes()
def write(rel, blob):
    dest = payload / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(blob)
rel = '.next/static/chunks/' + new_name
write(rel, new_css)
additions = [{'path': rel, 'sha256': sha(new_css)}]
replacements = []
for route in ['page', '[...slug]/page', 'preview/page', 'editor-preview/page', '_not-found/page']:
    rel = '.next/server/app/' + route + '_client-reference-manifest.js'
    old = (base / 'runtime' / rel).read_bytes()
    new = old.replace(old_name.encode(), new_name.encode())
    assert new != old
    write(rel, new)
    replacements.append({'path': rel, 'beforeSha256': sha(old), 'afterSha256': sha(new)})
edits = []
for entry in json.loads(raw)['entries']:
    if entry['key'] not in ['doma/laym', 'doma/limon', 'doma/citrus']:
        continue
    body = entry['data']['body']
    section = re.search(r'<section class="hr-comparison".*?</section>', body, re.S).group()
    cards = re.findall(r'<a class="hr-compare-card[^>]*>.*?</a>', section, re.S)
    current = [x for x in cards if 'href="/' + entry['key'] + '"' in x]
    assert len(cards) == 3 and len(current) == 1 and 'is-current' in current[0]
    edits.append({'key': entry['key'], 'beforePublished': entry['data'], 'before': current[0], 'after': ''})
assert len(edits) == 3
(p / 'content-patch.json').write_text(json.dumps({'edits': edits}, ensure_ascii=False, indent=2), encoding='utf-8')
manifest = json.loads((base / 'runtime-manifest.json').read_text(encoding='utf-8'))
rows = {r['path']: r for r in manifest['entries']}
for item in additions + replacements:
    blob = (payload / item['path']).read_bytes()
    rows[item['path']] = {'path': item['path'], 'type': 'file', 'bytes': len(blob), 'sha256': sha(blob)}
rows = sorted(rows.values(), key=lambda r: r['path'])
summary = {'files': sum(r['type']=='file' for r in rows), 'links': sum(r['type']=='link' for r in rows), 'bytes': sum(r.get('bytes',0) for r in rows), 'treeSha256': sha(json.dumps(rows, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode())}
(p / 'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':rows},ensure_ascii=False,indent=2),encoding='utf-8')
plan = {'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261026-house-cards','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(raw),'guards':[{'path':'.next/static/chunks/'+old_name,'sha256':sha(old_css)}],'additions':additions,'replacements':replacements}
(p / 'plan.json').write_text(json.dumps(plan,indent=2),encoding='utf-8')
print(json.dumps({'runtimeFiles':6,'cmsRecords':len(edits),'css':new_name}))
