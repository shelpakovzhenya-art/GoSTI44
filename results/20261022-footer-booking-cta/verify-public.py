from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json
import urllib.request

stage = Path(__file__).resolve().parent
raw = urllib.request.urlopen('https://tangerin.ru/api/content', timeout=30).read()
(stage / 'published-content-after.json').write_bytes(raw)
before = json.loads((stage / 'published-content-before.json').read_bytes())
after = json.loads(raw)
a = {e['key']: e for e in before['entries']}
b = {e['key']: e for e in after['entries']}
assert a.keys() == b.keys()
changed = [key for key in a if a[key] != b[key]]
assert changed == ['site-footer']
patch = json.loads((stage / 'content-patch.json').read_text(encoding='utf-8'))['edits'][0]
assert b['site-footer']['data'] == {'body': patch['expectedBody']}

class FooterParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.footer = 0
        self.removed = 0
        self.booking = 0
        self.uid = 0
    def handle_starttag(self, tag, attributes):
        d = dict(attributes)
        if 'site-footer-book' in d.get('class', '').split(): self.removed += 1
        if tag == 'footer' and 'site-footer' in d.get('class', '').split(): self.footer += 1
        if d.get('id') == 'footer-booking': self.booking += 1
        if tag == 'a' and d.get('href') == 'https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a': self.uid += 1

def check(entry):
    route = '/' + entry['key'].strip('/')
    if route == '/home': route = '/'
    with urllib.request.urlopen('https://tangerin.ru' + route, timeout=40) as response:
        html = response.read().decode('utf-8')
        status = response.status
    p = FooterParser()
    p.feed(html)
    assert status == 200 and p.removed == 0, (route, status, p.removed)
    if p.footer: assert p.booking == 1 and p.uid >= 1, (route, p.booking, p.uid)
    return {'route': route, 'status': status, 'removedCTA': p.removed, 'footer': p.footer, 'booking': p.booking, 'uidLink': p.uid}

pages = [e for e in after['entries'] if e['kind'] == 'page']
with ThreadPoolExecutor(max_workers=5) as pool:
    checks = list(pool.map(check, pages))
result = {'pages': len(checks), 'changedPublicEntries': changed, 'publishedApiSha256': hashlib.sha256(raw).hexdigest(), 'removedCTAOnAllPages': True, 'bookingAndUIDPreserved': True, 'checks': checks}
(stage / 'public-verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k != 'checks'}, ensure_ascii=False))
