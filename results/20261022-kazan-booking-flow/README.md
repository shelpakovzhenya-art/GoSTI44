# Kazan kit and Bnovo connection check — 22.10.2026

Published on https://tangerin.ru/vse-dlya-otdyha/mangalnaya-zona: “Казан (по запросу)” is now one item in the ready kit; the bottom notice no longer repeats it. The 1,700 ₽ rate and remaining terms are unchanged. Chrome1920/390 checked, no horizontal overflow.

One CMS page body changed in published/draft, two revisions. All other58 rows and unrelated draft fields preserved. Runtime and CMS source unchanged. Public API differs only by the expected body; the canonical local API mirror is synchronized. Exact transformations, guarded apply/backup/verification scripts, plan and bounded verification are included here. Full local report: `GoSTI44-production-20261020/changes/20261022-kazan-booking-flow/REPORT.md`.

Backup: `/var/www/gosti/backups/20261022-kazan-booking-flow`. Rollback restores the old target body fields only after checking the current page; do not restore the whole database over later edits.

Bnovo read-only audit after the user opened the account:

- The public search loads room categories and rates. In `/sales` and `/sales/edit/17758`, the module is connected/enabled and the UID matches the site's published UID.
- In `/hotel/edit/`, the property phone/email match the client's public contacts. In `/bookings?status=8`, at least one existing booking has source “Модуль бронирования”. No guest identifiers/details were saved.
- The user ultimately chose to keep the same module/account as the other site. No Bnovo settings, bookings, tariffs, notification subscriptions or payments changed. The tab was returned to its original planning view.
- Receipt of a NEW test booking and actual email/push delivery remain unverified; no test reservation or messages were submitted. [Bnovo's hotel settings guide](https://help.bnovo.ru/knowledgebase/hotel/) explains notification addresses.
- The account displayed an access-expiry warning for26.10.2026; the user was informed. This is a displayed warning, not verification of billing settlement.

The artifacts contain no credentials, guest data, account tokens, database backups, private drafts, chat attachments or browser-session exports.
