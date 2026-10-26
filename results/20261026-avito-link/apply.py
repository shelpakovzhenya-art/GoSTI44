import copy
import datetime
import json
import os
from pathlib import Path
import sqlite3

OLD = 'https://www.avito.ru/user/23247c55bfeed02f5abc30847c6ce191/profile?src=sharing'
NEW = 'https://www.avito.ru/brands/i88220667'
DB = '/var/www/gosti/shared/database.sqlite'
BACKUP = Path('/var/www/gosti/backups/20261026-avito-link')
os.umask(0o077)
BACKUP.mkdir(exist_ok=False)
c = sqlite3.connect(DB)
c.row_factory = sqlite3.Row
with sqlite3.connect(BACKUP / 'database.sqlite') as b:
    c.backup(b)
    assert b.execute('pragma integrity_check').fetchone()[0] == 'ok'
c.execute('BEGIN IMMEDIATE')
try:
    before = {r['key']: dict(r) for r in c.execute('select * from content_entries')}
    revisions = c.execute('select count(*) from content_revisions').fetchone()[0]
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
    expected = copy.deepcopy(before)
    for key, kind in [('rating-avito', 'rating'), ('site-settings', 'settings')]:
        row = before[key]
        assert row['kind'] == kind
        updates = {}
        for field in ['published', 'draft']:
            data = json.loads(row[field])
            if key == 'rating-avito':
                assert data['url'] == OLD
                data['url'] = NEW
            else:
                targets = [f for f in data['fields'] if f['key'] == 'avito']
                assert len(targets) == 1 and targets[0]['value'] == OLD
                targets[0]['value'] = NEW
            updates[field] = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
        expected[key].update(updates, updated_at=now, published_at=now)
        c.execute('update content_entries set published=?,draft=?,updated_at=?,published_at=? where id=?',
                  (updates['published'], updates['draft'], now, now, row['id']))
        for field, action in [('published', 'publish'), ('draft', 'draft')]:
            c.execute('insert into content_revisions(content_entry_id,user_id,action,data,created_at,updated_at) values (?,NULL,?,?,?,?)',
                      (row['id'], action, updates[field], now, now))
    after = {r['key']: dict(r) for r in c.execute('select * from content_entries')}
    assert after == expected
    assert c.execute('select count(*) from content_revisions').fetchone()[0] == revisions + 4
    assert c.execute('pragma integrity_check').fetchone()[0] == 'ok'
    c.commit()
except BaseException:
    c.rollback()
    raise
result = {'changedEntries': ['rating-avito', 'site-settings'], 'newUrl': NEW,
          'otherRowsUnchanged': len(before)-2, 'otherDraftFieldsPreserved': True,
          'revisionsAdded': 4, 'backup': str(BACKUP), 'databaseIntegrity': 'ok'}
(BACKUP / 'verification.json').write_text(json.dumps(result, indent=2))
print(json.dumps(result))
