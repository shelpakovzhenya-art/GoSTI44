# Children reference corrections — 2026-10-26

Published: https://tangerin.ru/vse-dlya-otdyha/s-detmi

Corrected the differences identified against the supplied reference:

- Hero photo blends into the text area; removed separate boxed presentation and adjusted title/photo proportions.
- Hidden the page's extra breadcrumb/back rows to match the reference's uninterrupted composition.
- Removed the green cot-price note panel, including its padding and pseudo-elements; explanatory text now sits directly under the price.
- Free-equipment list runs down the left column (chair, potty, step) and then the right (toys, books), matching the reference.
- Adjusted card aspect ratios, rounded text panels, spacing and title sizes.
- Enlarged the orange decoration, layered flowering leaves and a soft leaf shadow, and aligned the contact panel and buttons.

Existing site photographs, global header/logo and the previously requested working booking layout remain in use; this is not a claim that those assets are identical to the reference illustration.

Preview and live Chrome-extension inspection at320/390/768/1366: no horizontal overflow, price note transparent/zero padding, list column positions3+2, four contact links preserved. Desktop/mobile hero blending verified. Live footer booking has three inputs; final production error log empty. No bookings/messages submitted.

CSS-only: one new CSS and five manifests; all59 CMS rows, public API and revisions unchanged. SQLite integrity ok. Backup `/var/www/gosti/backups/20261026-children-reference`. Rollback: restore the five manifests from backup and restart gosti; previous CSS remains available. Active CSS `1m2h-children-reference-20261026.css`. Runtime1855 files, tree SHA `7ce9b4617d65cf676ab5f270e6111d3590e6cb8f51405406ef79a751782bba48`.

Implementation `reference.css`, `prepare.py`, `apply-production.py`; aggregate checks `verification.json` and `public-verification.json`. Full payload/manifests remain local and are not committed.
