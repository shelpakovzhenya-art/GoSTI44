import hashlib
import json
import pathlib
import shutil

root = pathlib.Path(__file__).parent
runtime = root / 'runtime'
change = root / 'changes/20261020-mobile-buttons'
payload = change / 'payload'
old_name = '1m2h-mobile-header-icons-20261019.css'
new_name = '1m2h-mobile-buttons-20261020.css'
old_css = runtime / '.next/static/chunks' / old_name
new_css = payload / '.next/static/chunks' / new_name
new_css.parent.mkdir(parents=True, exist_ok=True)
new_css.write_bytes(old_css.read_bytes() + b'\n' + (root / 'mobile-buttons.css').read_bytes())
plan = {
    'productionRoot': '/var/www/gosti/releases/20260925-2/.next/standalone',
    'baseTreeSha256': '7533718dc63794300ef016acf45a6ca28236d9549e552180d497ac03e44d91d7',
    'originalStylesheet': {'path': old_css.relative_to(runtime).as_posix(), 'sha256': hashlib.sha256(old_css.read_bytes()).hexdigest()},
    'newStylesheet': {'path': new_css.relative_to(payload).as_posix(), 'sha256': hashlib.sha256(new_css.read_bytes()).hexdigest()},
    'replacements': [],
}
for file in sorted((runtime / '.next').rglob('*')):
    if not file.is_file() or file.suffix not in {'.js', '.json'}:
        continue
    before = file.read_bytes()
    if old_name.encode() not in before:
        continue
    after = before.replace(old_name.encode(), new_name.encode())
    rel = file.relative_to(runtime)
    dest = payload / rel
    backup = change / 'before' / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    backup.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(after)
    shutil.copy2(file, backup)
    plan['replacements'].append({'path': rel.as_posix(), 'beforeSha256': hashlib.sha256(before).hexdigest(), 'afterSha256': hashlib.sha256(after).hexdigest()})
assert len(plan['replacements']) == 5, plan['replacements']
(change / 'plan.json').write_text(json.dumps(plan, indent=2), encoding='utf8')
shutil.copy2(root / 'mobile-buttons.css', change / 'mobile-buttons.css')
print(json.dumps({'newStylesheet': plan['newStylesheet']['path'], 'manifests': len(plan['replacements'])}))
