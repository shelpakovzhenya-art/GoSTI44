# Compact large-company closing panel —22.10.2026

Published on https://tangerin.ru/dlya-bolshoy-kompanii.

The closing sentence now reads: “Напишите нам количество гостей и даты поездки — поможем подобрать размещение.” The heading and four contact links are preserved. Scoped CSS removes excess padding/gaps and places text beside contacts on desktop; at1023px and below it stacks. Body text remains17/16px, contact targets48px. Other sections and the outer panel width are unchanged.

Chrome geometry checked at1920/1440/1024/768/390/320; desktop1440 and mobile390 visually inspected. No horizontal overflow; all four contacts fit. Heights:1920px320.7→142.4,390px386.7→316.0,320px436.3→365.6. Hero CTA reaches the panel without a hash in the URL; the footer booking button loads. No reservations submitted or Bnovo settings changed.

One CMS body changed in published/draft, two revisions. All other58 rows and unrelated draft fields preserved, SQLite integrity OK. CMS code, JS and SEO unchanged. Runtime: one new versioned CSS asset and five manifest replacements. Local runtime tree matches server. Exact guards/hashes and bounded evidence are in `plan.json` and `verification.json`; only readable scoped CSS/body transforms and guarded deployment scripts are included here.

Backup `/var/www/gosti/backups/20261022-company-closing`: previous manifests and a private consistent database backup. Rollback restores the five previous manifests and restarts gosti, then restores only the target body fields after a current-state check; never restore the whole DB over later edits. Old CSS retained. Full canonical report: `GoSTI44-production-20261020/changes/20261022-company-closing/REPORT.md`.

No credentials, private drafts, guest data, database/archive exports or chat/browser-session data are included.
