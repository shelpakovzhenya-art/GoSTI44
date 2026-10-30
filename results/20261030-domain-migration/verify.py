import json, subprocess, urllib.request
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).parent
rows = []
for host in ('gostevoidom44.ru', 'www.gostevoidom44.ru'):
    for scheme, port in (('http', 80), ('https', 443)):
        for path, status, target in (
            ('/', 301, 'https://tangerin.ru/'),
            ('/page26164900.html?utm_source=migration-check', 301, 'https://tangerin.ru/?utm_source=migration-check'),
            ('/page26590216.html', 410, None),
            ('/migration-check-not-found', 404, None),
            ('/robots.txt', 200, None),
            ('/sitemap.xml', 301, 'https://tangerin.ru/sitemap.xml'),
        ):
            url = f'{scheme}://{host}{path}'
            headers = subprocess.check_output(['curl.exe','-sS','-I','--resolve',f'{host}:{port}:186.246.50.205',url], text=True)
            actual = int(headers.splitlines()[0].split()[1])
            location = next((line.split(': ',1)[1] for line in headers.splitlines() if line.lower().startswith('location: ')),None)
            rows.append(dict(url=url,status=actual,location=location,pass_check=actual==status and location==target))

dns = {}
for host in ('gostevoidom44.ru','www.gostevoidom44.ru'):
    data = json.load(urllib.request.urlopen(f'https://dns.google/resolve?name={host}&type=A'))
    dns[host] = data.get('Answer',[])
result = dict(checked_at=datetime.now(timezone.utc).isoformat(),method='curl --resolve to production IP; TLS validation enabled; DNS separately checked',checks=rows,dns=dns)
(ROOT/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
assert all(row['pass_check'] for row in rows), result
print(f'{len(rows)}/{len(rows)} redirect/status checks passed; DNS: {dns}')
