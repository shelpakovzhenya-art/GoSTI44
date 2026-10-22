import hashlib
import json
import os
import pathlib
import sys

root = pathlib.Path(sys.argv[1]).resolve()
rows = []
for directory, dirs, files in os.walk(root, followlinks=False):
    for name in dirs + files:
        p = pathlib.Path(directory) / name
        rel = p.relative_to(root).as_posix()
        if p.is_symlink():
            rows.append({'path': rel, 'type': 'link', 'target': os.readlink(p)})
        elif p.is_file():
            h = hashlib.sha256()
            with p.open('rb') as stream:
                for block in iter(lambda: stream.read(1024 * 1024), b''):
                    h.update(block)
            rows.append({'path': rel, 'type': 'file', 'bytes': p.stat().st_size, 'sha256': h.hexdigest()})
rows.sort(key=lambda row: row['path'])
digest = hashlib.sha256(json.dumps(rows, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
summary = {'files': sum(r['type'] == 'file' for r in rows), 'links': sum(r['type'] == 'link' for r in rows), 'bytes': sum(r.get('bytes', 0) for r in rows), 'treeSha256': digest}
if len(sys.argv) > 2:
    pathlib.Path(sys.argv[2]).write_text(json.dumps({'summary': summary, 'entries': rows}, ensure_ascii=False, indent=2), encoding='utf8')
print(json.dumps(summary))
