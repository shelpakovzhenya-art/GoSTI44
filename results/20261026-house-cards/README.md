# House cards and comparison — 2026-10-26

Published the client's three changes on https://tangerin.ru/:

- Catalog “Выбрать даты” buttons reduced from 66.78 px to 44 px. Neighboring house links use the same compact height.
- Area labels, including “Площадь — 100 м²”, stay on one line on desktop and mobile. Narrow-screen icon/text spacing fits 320 px.
- Each house page lists only the other two houses under “Сравните с другими домами”. The current house card is removed from both published and draft HTML, not merely hidden. Desktop has two columns; mobile has one.

Preview and production browser checks used the Chrome extension at 320/390/768/1024/1366/1920 px: all three catalog cards have 44 px buttons, unbroken area labels, fitting text, and no horizontal page overflow. Comparison checks covered all three house pages at 320/390/1366 px, with two correct links and no overflow. Desktop/mobile screenshots were visually inspected. The catalog button scrolls to the booking section (top ~120 px; widget height 260 px); opening Lime from the catalog loads only Lemon and Citrus in comparison. No test bookings were submitted. Final browser error log was empty; the historical unrelated hydration issue is not claimed fixed.

Public verification: 23 sitemap pages HTTP 200, SSR comparisons have exactly the two other house URLs, public house bodies match the intended removals, and served CSS matches the patch. See `public-verification.json` and `verification.json`.

Production: three CMS rows changed, six revisions added; all other 56 rows and unrelated draft fields preserved. SQLite integrity ok. One new CSS plus five client-reference manifests; no JS or CMS application code changed. Active CSS: `1m2h-house-cards-20261026.css`. Styling uses the existing `clientPalette` layer because its important typography rules otherwise override ordinary CSS.

Backup: `/var/www/gosti/backups/20261026-house-cards`. Rollback: restore the five manifests from this backup, restart `gosti`, and restore only the removed current-house fragments from the three saved database rows, preserving subsequent CMS changes and recording revisions. Do not overwrite the full live database with the backup. The prior CSS remains available.

Implementation: `cards.css`, `prepare.py`, `apply-production.py`, `verify-public.py`. Payload, full public content spec and full runtime manifest remain local; they contain no credentials and are not part of the result commit. Canonical runtime/public API/snapshot are synchronized after verification. Existing unrelated source worktree changes are preserved.
