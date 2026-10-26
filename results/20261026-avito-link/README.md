# Avito replacement — 2026-10-26

Requested destination: https://www.avito.ru/brands/i88220667

Live https://tangerin.ru/api/content still contains the old profile URL in `rating-avito.data.url` and the `avito` item of `site-settings.data.fields`. Both must be updated; preserve all other published and draft values.

Publication pending authentication: available SSH keys were rejected by the server. Chrome opened https://tangerin.ru/admin/login and showed an unauthenticated login form. User asked to log in locally; no credentials requested in chat. Production has not been changed.

Next: after login, inspect both current CMS entries and draft differences, change only the two URL values, publish, verify public API plus homepage/contact/footer outgoing links. Record actual outcome before marking complete.
