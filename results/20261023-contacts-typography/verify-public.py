from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib, json, urllib.request

stage = Path(__file__).resolve().parent
raw = urllib.request.urlopen('https://tangerin.ru/api/content', timeout=30).read()
assert raw == (stage / 'published-content-before.json').read_bytes()
entries = json.loads(raw)['entries']
plan = json.loads((stage / 'plan.json').read_text())

def check(entry):
    route = '/' if entry['key'] == 'home' else '/' + entry['key']
    with urllib.request.urlopen('https://tangerin.ru' + route, timeout=40) as response:
        html = response.read().decode()
        assert response.status == 200
    assert '1m2h-contacts-type-20261023.css' in html
    if route not in ['/soglasie-na-obrabotku-personalnyh-dannyh', '/usloviya-bronirovaniya', '/politika-obrabotki-personalnyh-dannyh']:
        assert '3cltmr-faq-menu-v2-20261022.js' in html
    return {'route': route, 'status': 200, 'activeCSS': True}

with ThreadPoolExecutor(max_workers=5) as pool:
    checks = list(pool.map(check, [e for e in entries if e['kind'] == 'page']))
for item in plan['additions']:
    url = 'https://tangerin.ru/' + item['path'].replace('.next/', '_next/', 1)
    asset = urllib.request.urlopen(url, timeout=30).read()
    assert hashlib.sha256(asset).hexdigest() == item['sha256']
result = {'pages': len(checks), 'publishedEntriesUnchanged': True, 'publishedApiSha256': hashlib.sha256(raw).hexdigest(), 'assetSHAsVerified': True, 'checks': checks}
(stage / 'public-verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
print(json.dumps({k: v for k, v in result.items() if k != 'checks'}))
