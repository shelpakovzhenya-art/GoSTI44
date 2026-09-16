# Состояние проекта

Обновлено 17.09.2026.

- Production: https://tangerin.a-test.ru/.
- Активный release: `/var/www/gosti/releases/20260917-1`, коммит `b86d142`.
- CMS: `/var/www/gosti/releases/20260917-1/cms`; база: `/var/www/gosti/shared/database.sqlite`; постоянное storage: `/var/www/gosti/releases/20260909-1/cms/storage`.
- Индексация тестового домена отключена через header и meta noindex. Основной домен заказчик определит позже.
- Последнее изменение: путеводитель расширен по фактическому спросу Яндекс Wordstat. Добавлены `/kostroma/muzei`, `/kostroma/za-odin-den`, `/kostroma/s-detmi` и `/kostroma/chto-privezti`; страницы «Где поесть» и «Достопримечательности» сохранены как основные URL своих кластеров без SEO-дублей.
- В публичных текстах используется «дом»; баня находится в «Всё для отдыха», отдельного SPA и пункта меню нет.
- Browser QA: все семь страниц путеводителя проверены на 390 и 1440 px; переполнения, выходящих за экран ссылок, битых изображений и console errors нет. Восемь публичных маршрутов, API CMS, admin login, 11 ресурсов Filament/Livewire и favicon отвечают `200`; noindex сохранён.
- Миграция `2026_09_16_223000_add_wordstat_guide_pages` применена batch 8; `PRAGMA integrity_check` — `ok`.
- Резервная копия базы перед миграцией: `/var/www/gosti/backups/database-20260917-before-wordstat-guides.sqlite`, права `600`.
- Предыдущий release для отката: `/var/www/gosti/releases/20260916-5`.

Следующий шаг: после выбора основного домена обновить `SITE_URL`, canonical, sitemap, сертификат и только после отдельной проверки разрешить индексацию.
