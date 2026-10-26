# Children page, compact booking and footer — 2026-10-26

Published pages for client review:

- https://tangerin.ru/vse-dlya-otdyha/s-detmi — reference composition: bedroom hero with introductory text, cot/free equipment cards, separate contact panel with citrus decoration, booking below. Existing photos, 1,000 RUB per-stay cot price, free equipment and four contact destinations retained. Added the explanatory copy supplied in the reference.
- https://tangerin.ru/#booking-top — an additional booking form immediately before the benefits section. Independent host and attribution-link IDs; existing Bnovo UID and defaults preserved.
- https://tangerin.ru/#booking — compact full-width booking fields; question button and multi-house help text retained in both homepage forms.
- Shared footer: removed duplicate phone/address/social block beside the logo and the separate repeated contact-button row. Compact complete logo, navigation and legal/contact details retained.

Desktop uses Bnovo's horizontal mode; narrow containers use vertical mode with all three fields. Resize observers remount the affected widget through the existing lifecycle helper when the width crosses 700 px. This avoids Bnovo's horizontal narrow-screen button-only display. Vendor SDK was not edited. Orientation support documented by Bnovo: https://help.bnovo.ru/knowledgebase/bookingengine-widget/ . No test reservations or messages were sent.

Validation: preview and production desktop/mobile inspection; children page at320/390/768/1024/1366 has two equipment cards, four contact links and no overflow. Both home forms have three fields on390px (y=0/64/128), and all fields in one row on1366px (y=0/0/0). The top form precedes benefits. Guest selectors in both forms and the top calendar opened. Repeated home→children→home→children navigation restored the appropriate widgets. Final production browser error log empty. Local preview's cookie-configuration error was confined to its missing local endpoint; production did not reproduce it.

Public checks:23 sitemap pages HTTP200; both CMS bodies match exact transformations; unique homepage widget hosts; Avito URL preserved; all five new asset SHA values verified. See `public-verification.json`, `verification.json`, `resize-verification.json`, `browser-verification.json`.

Two CMS records changed (`vse-dlya-otdyha/s-detmi`, `site-footer`), four revisions; other57 rows and unrelated draft fields preserved, SQLite ok. Initial patch9 runtime files; responsive correction6 files with no CMS changes. Against the task baseline:5 added CSS/JS assets and6 modified existing runtime files (11 distinct paths), including the SSR landing module and five manifests. No CMS application code changed.

Active CSS `1m2h-children-booking-v3-20261026.css`; home JS `1iyslc2xp3jm8-horizontal-v3-20261026.js`; common JS `3cltmr-horizontal-v3-20261026.js`. Complete runtime tree SHA `9329d6934fd2da6bec199aa4604eb0699becad19bb83f1399417d24ac9dfed97`.

Backups: `/var/www/gosti/backups/20261026-children-booking` and `/var/www/gosti/backups/20261026-children-booking-resize`. For complete rollback restore the initial backup's six replaced runtime files, restart `gosti`, and reverse only the two CMS body transformations with revisions while preserving subsequent edits. Never restore the whole database over newer content. New unused assets may remain harmlessly available. Local canonical runtime/API/manifest/snapshot synchronized and existing unrelated worktree changes preserved.

Reproduction artifacts: `changes.css`, `prepare.py`, `apply-production.py`, then `prepare-resize.py` for the guarded responsive correction, `verify-public.py`. Full runtime payloads and full content specs stay local and out of the result commit. Credentials, databases, browser data and user screenshots are not committed.

Standing user preference recorded: always provide direct links to the pages being edited and repeat them in the final response.

Cleanup: preview processes stopped and remote task staging directories removed. Automatic approval review blocked deletion of the local preview copy; it remains excluded from Git. Server backups remain available for rollback.
