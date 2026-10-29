from pathlib import Path
import json, hashlib, urllib.request

p = Path(__file__).resolve().parent
base = p.parent.parent
payload = p / 'payload'
sha = lambda b: hashlib.sha256(b).hexdigest()
api = urllib.request.urlopen('https://tangerin.ru/api/content', timeout=30).read()
assert api == (p / 'published-content-before.json').read_bytes() == (base / 'public-evidence/published-content.json').read_bytes()
manifest = json.loads((base / 'runtime-manifest.json').read_text(encoding='utf8'))
rows = {r['path']: r for r in manifest['entries']}
names = {'3cltmr-hydration-20261026.js':'3cltmr-bnovo-reliable-20261029.js', '1iyslc2xp3jm8-faq-paragraph-20261028.js':'1iyslc2xp3jm8-bnovo-reliable-20261029.js'}
guards, additions, replacements = [], [], []
for old, new in names.items():
    rel = '.next/static/chunks/' + old
    raw = (base / 'runtime' / rel).read_bytes()
    assert raw == urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/' + old, timeout=30).read()
    text = raw.decode()
    if old.startswith('3cltmr'):
        start = text.index('  let watched, loadWatched;')
        end = text.index("  document.addEventListener('click',event=>{", start)
        fragment = (p / 'booking-manager.js').read_text(encoding='utf8') + '\n' + (p / 'footer-loader.js').read_text(encoding='utf8') + '\n'
    else:
        start = text.index('let stopped=false,mounting=false,cleanupBooking,bookingLayout;')
        end = text.index('},[s.booking,widgetId]);', start)
        fragment = (p / 'home-effect.js').read_text(encoding='utf8') + '\n  '
    content = (text[:start] + fragment + text[end:]).encode()
    dest = payload / '.next/static/chunks' / new
    dest.parent.mkdir(parents=True, exist_ok=True); dest.write_bytes(content)
    guards.append({'path':rel,'sha256':sha(raw)})
    additions.append({'path':'.next/static/chunks/' + new,'sha256':sha(content)})
for row in manifest['entries']:
    if not row['path'].startswith('.next/server/') or not row['path'].endswith('.js'): continue
    raw = (base / 'runtime' / row['path']).read_bytes()
    content = raw
    for old,new in names.items(): content = content.replace(old.encode(),new.encode())
    if raw == content: continue
    assert row['path'].endswith('page_client-reference-manifest.js'), row['path']
    dest = payload / row['path']; dest.parent.mkdir(parents=True,exist_ok=True); dest.write_bytes(content)
    replacements.append({'path':row['path'],'beforeSha256':sha(raw),'afterSha256':sha(content)})
assert len(replacements) == 4, len(replacements)
for item in additions + replacements:
    blob = (payload / item['path']).read_bytes()
    rows[item['path']] = {'path':item['path'],'type':'file','bytes':len(blob),'sha256':sha(blob)}
entries = sorted(rows.values(),key=lambda r:r['path'])
summary = {'files':sum(r['type']=='file' for r in entries),'links':sum(r['type']=='link' for r in entries),'bytes':sum(r.get('bytes',0) for r in entries),'treeSha256':sha(json.dumps(entries,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(p/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':entries},ensure_ascii=False,indent=2),encoding='utf8')
plan = {'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261029-bnovo-reliability','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(api),'guards':guards,'additions':additions,'replacements':replacements}
(p/'plan.json').write_text(json.dumps(plan,indent=2),encoding='utf8')
print(json.dumps({'newAssets':list(names.values()),'manifests':len(replacements),'CMSChanged':False,'runtimeBefore':manifest['summary']}))
