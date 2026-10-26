# Avito link updated ? 2026-10-26

Published https://www.avito.ru/brands/i88220667 in both `rating-avito.url` and `site-settings.fields[key=avito].value`, in published and draft data.

Verification: public API contains both new values; https://tangerin.ru/ returns HTTP 200 with all three Avito hrefs pointing to the new URL. https://tangerin.ru/kontakty and https://tangerin.ru/doma/limon return HTTP 200 with new settings in page data and no old profile URL (these pages have no Avito hrefs).

Exactly two CMS records changed; other 57 records and unrelated draft fields preserved, four revisions added, SQLite integrity ok. No runtime files changed. Backup: `/var/www/gosti/backups/20261026-avito-link/database.sqlite`. Rollback should restore only the two URL fields from backup and add revisions, preserving later edits; do not restore the entire database over later changes.

Server authentication succeeded using user-provided credentials; no credentials persisted in task artifacts. Destination profile content itself was not verified. `apply.py` records the guarded transformation; `verification.json` records checks. Local public API snapshot refreshed.
