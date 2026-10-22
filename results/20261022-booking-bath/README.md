# Tangerin: booking loading and bath typography, 22.10.2026

Deployed and verified on https://tangerin.ru/ using the current production runtime. Old editable sources/default branch were not rebuilt or deployed.

The widget previously downloaded its SDK only when approaching the form. It now starts during browser idle time and the home page also warms the SDK before the form finishes hydrating. SPA navigation home→house left the persistent footer hidden because the unchanged-host guard returned before route visibility was updated; that order is corrected. Bnovo's document-click callback also retained an iframe removed by React. The scoped lifecycle helper removes those synchronous SDK registrations when the host disconnects or the home effect cleans up. It restores addEventListener in finally; the vendor SDK remains external and unmodified.

The bath page's “7 700 ₽” and “Стоимость по запросу” are now 24px desktop / 22px mobile (formerly 30/26). Prices and conditions are unchanged: https://tangerin.ru/vse-dlya-otdyha/banya-i-kupel.

Verification in `verification.json`:

- All 23 public pages at 1440/390px plus menu navigation and all three home→house→home paths: 60/60 ready, exactly one visible form, zero JavaScript errors. Ready means the actual availability button inside the iframe is visible.
- Guest dropdown opens and closes on outside click on home/business × desktop/mobile: 4/4. No reservation was submitted.
- Bath at 1440/1024/768/390/320px: both exact texts, 24/22px, four contacts, no horizontal overflow/errors.
- Four cold samples: SDK requested before arrival at the form in 4/4 after vs 0/4 before. Mean wait after arrival 1202.5→396ms. This small observation does not guarantee external Bnovo response times.
- All 59 CMS rows unchanged, zero revisions, public API unchanged, SQLite integrity OK, service active. Local runtime tree matches server.

Reviewed artifacts: `bath.css`, `footer-loader.js`, `bnovo-lifecycle.js`, `home-effect.diff`, guarded `plan.json`, `apply-runtime.py` and `verify-server.py`. The home diff targets only the live effect; the footer/helper fragments replace only their reviewed runtime segment. CSS/common/home assets are versioned by new names; five client-reference manifests select them. Do not use these fragments to rebuild stale September sources. Full local report is `GoSTI44-production-20261020/changes/20261022-booking-bath/REPORT.md`.

Server backup `/var/www/gosti/backups/20261022-booking-bath`: five previous manifests and a private consistent database backup. Rollback restores only the five manifests and restarts gosti; this task changed no CMS data. Original assets are retained. Runtime before/after hashes and all eight payload hashes are in the plan. No credentials, database exports, private drafts, archives or chat data are included here.
