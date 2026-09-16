# Состояние проекта

Обновлено 16.09.2026.

- Production: https://tangerin.a-test.ru/.
- Активный frontend: `/var/www/gosti/releases/20260916-1`, коммит `b0e89507257b5412e968731e20341a749974f963`.
- CMS: `/var/www/gosti/releases/20260915-1/cms`; база: `/var/www/gosti/shared/database.sqlite`; постоянное storage: `/var/www/gosti/releases/20260909-1/cms/storage`.
- Индексация тестового домена отключена через header и meta noindex. Основной домен заказчик определит позже.
- Последнее изменение: увеличена читаемость блока выбора домов и блока большой компании; адаптив проверен на 320–2560 px.
- Предыдущий frontend для отката: `/var/www/gosti/releases/20260915-14`.

Следующий шаг: после выбора основного домена обновить `SITE_URL`, canonical, sitemap, сертификат и только после отдельной проверки разрешить индексацию.
