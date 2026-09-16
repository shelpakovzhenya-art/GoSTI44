# Состояние проекта

Обновлено 16.09.2026.

- Production: https://tangerin.a-test.ru/.
- Активный release: `/var/www/gosti/releases/20260916-3`, коммит `6ae83c496e8adf3c3ff659091e13f348c4bebc3b`.
- CMS: `/var/www/gosti/releases/20260916-3/cms`; база: `/var/www/gosti/shared/database.sqlite`; постоянное storage: `/var/www/gosti/releases/20260909-1/cms/storage`.
- Индексация тестового домена отключена через header и meta noindex. Основной домен заказчик определит позже.
- Последнее изменение: добавлены отдельные посадочные «Лайма», «Лимона», «Цитруса» и страница размещения большой компании. Контент редактируется в CMS; главная и меню приведены к формулировкам клиента.
- Browser QA: локально 320, 390 и 1280 px. Production: пять маршрутов, API CMS, admin login, CSS/JS и изображения отвечают успешно; noindex сохранён.
- Резервная копия базы перед миграцией: `/var/www/gosti/backups/database-20260916-1951-before-house-landings.sqlite`.
- Предыдущий release для отката: `/var/www/gosti/releases/20260916-1`.

Следующий шаг: после выбора основного домена обновить `SITE_URL`, canonical, sitemap, сертификат и только после отдельной проверки разрешить индексацию.
