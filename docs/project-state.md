# Состояние проекта

Обновлено 16.09.2026.

- Production: https://tangerin.a-test.ru/.
- Активный release: `/var/www/gosti/releases/20260916-5`, коммит `7f99de2`.
- CMS: `/var/www/gosti/releases/20260916-5/cms`; база: `/var/www/gosti/shared/database.sqlite`; постоянное storage: `/var/www/gosti/releases/20260909-1/cms/storage`.
- Индексация тестового домена отключена через header и meta noindex. Основной домен заказчик определит позже.
- Последнее изменение: отдельные посадочные домов и большой компании дополнены путеводителем `/kostroma`, страницами «Где поесть» и «Достопримечательности». В публичных текстах используется «дом»; баня перенесена в «Всё для отдыха», отдельного SPA и пункта меню нет.
- Browser QA production: 320, 390, 768, 1265 и 1440 px для главной, «Лайма» и трёх страниц путеводителя. Переполнения, битых изображений, console/runtime errors и старой терминологии нет. Восемь публичных маршрутов, API CMS, admin login, Next/Filament assets и favicon отвечают `200`; noindex сохранён.
- Резервная копия базы перед миграцией: `/var/www/gosti/backups/database-20260916-2248-before-kostroma-guides.sqlite`.
- Предыдущий release для отката: `/var/www/gosti/releases/20260916-4`.

Следующий шаг: после выбора основного домена обновить `SITE_URL`, canonical, sitemap, сертификат и только после отдельной проверки разрешить индексацию.
