from pathlib import Path
import os, json, hashlib, sqlite3, shutil, urllib.request

stage = Path(__file__).resolve().parent
plan = json.loads((stage / 'plan.json').read_text())
base = Path(plan['productionRoot'])
assert Path('/var/www/gosti/current/.next/standalone').resolve() == base
rows = []
for directory, dirs, files in os.walk(base, followlinks=False):
    for name in dirs + files:
        p = Path(directory) / name
        rel = p.relative_to(base).as_posix()
        if p.is_symlink():
            rows.append({'path': rel, 'type': 'link', 'target': os.readlink(p)})
        elif p.is_file():
            rows.append({'path': rel, 'type': 'file', 'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()})
rows.sort(key=lambda r: r['path'])
assert hashlib.sha256(json.dumps(rows, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest() == plan['runtimeBefore']['treeSha256']
assert hashlib.sha256(urllib.request.urlopen('https://tangerin.ru/api/content', timeout=30).read()).hexdigest() == plan['publishedAPI']
backup = Path(plan['backup'])
backup.mkdir(mode=0o700, exist_ok=False)
with sqlite3.connect('file:/var/www/gosti/shared/database.sqlite?mode=ro', uri=True) as source:
    with sqlite3.connect(backup / 'database.sqlite') as target:
        source.backup(target)
        assert target.execute('pragma integrity_check').fetchone()[0] == 'ok'
(backup / 'database.sqlite').chmod(0o600)
for name in ['plan.json', 'backup.py', 'apply-content.php', 'content-patch.json', 'verify-server.py']:
    shutil.copyfile(stage / name, backup / name)
    (backup / name).chmod(0o600)
print(json.dumps({'backup': str(backup), 'runtimeUnchanged': True, 'databaseIntegrity': 'ok'}))
