from pathlib import Path
import json, hashlib, urllib.request

p = Path(__file__).resolve().parent
base = p.parent.parent
sha = lambda b: hashlib.sha256(b).hexdigest()
raw = urllib.request.urlopen('https://tangerin.ru/api/content', timeout=30).read()
assert raw == (p / 'published-content-before.json').read_bytes(), 'CMS changed'
scope = 'html:root body:has(#main):has(#main):has(#main):has(#main) #main#main #rs-contacts#rs-contacts'
old_name, new_name = '1m2h-faq-legal-v4-20261022.css', '1m2h-contacts-type-20261023.css'
rel = '.next/static/chunks/' + old_name
old_css = (base / 'runtime' / rel).read_bytes()
assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/' + old_name).read() == old_css
new_css = old_css + b'\n\n' + (p / 'contacts-typography.css').read_text(encoding='utf8').replace('CONTACTS_SCOPE', scope).encode()
payload = p / 'payload'
dest = payload / '.next/static/chunks' / new_name
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_bytes(new_css)
additions = [{'path': '.next/static/chunks/' + new_name, 'sha256': sha(new_css)}]
replacements = []
for route in ['page', '[...slug]/page', 'preview/page', 'editor-preview/page', '_not-found/page']:
    rel = '.next/server/app/' + route + '_client-reference-manifest.js'
    old = (base / 'runtime' / rel).read_bytes()
    new = old.replace(old_name.encode(), new_name.encode())
    assert new != old
    dest = payload / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(new)
    replacements.append({'path': rel, 'beforeSha256': sha(old), 'afterSha256': sha(new)})
manifest = json.loads((base / 'runtime-manifest.json').read_text(encoding='utf8'))
rows = {r['path']: r for r in manifest['entries']}
for item in additions + replacements:
    blob = (payload / item['path']).read_bytes()
    rows[item['path']] = {'path': item['path'], 'type': 'file', 'bytes': len(blob), 'sha256': sha(blob)}
rows = sorted(rows.values(), key=lambda r: r['path'])
summary = {'files': sum(r['type'] == 'file' for r in rows), 'links': sum(r['type'] == 'link' for r in rows), 'bytes': sum(r.get('bytes', 0) for r in rows), 'treeSha256': sha(json.dumps(rows, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode())}
(p / 'runtime-expected.json').write_text(json.dumps({'summary': summary, 'entries': rows}, ensure_ascii=False, indent=2), encoding='utf8')
plan = {'productionRoot': '/var/www/gosti/releases/20260925-2/.next/standalone', 'backup': '/var/www/gosti/backups/20261023-contacts-typography', 'runtimeBefore': manifest['summary'], 'runtimeAfter': summary, 'publishedAPI': sha(raw), 'guards': [{'path': '.next/static/chunks/' + old_name, 'sha256': sha(old_css)}], 'additions': additions, 'replacements': replacements}
(p / 'plan.json').write_text(json.dumps(plan, indent=2), encoding='utf8')
print(json.dumps({'CMSPagesChanged': 0, 'runtimeFiles': 6, 'oldCSS': old_name, 'newCSS': new_name}))
