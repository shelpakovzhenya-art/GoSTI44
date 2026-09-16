# Развёртывание и эксплуатация — 09.09.2026

## Адреса и службы

- Сайт: https://tangerin.a-test.ru/ ; CMS: https://tangerin.a-test.ru/admin .
- HTTP, IP 186.246.50.205 и www перенаправляются на основной HTTPS-адрес.
- Nginx 80/443 → Next.js 127.0.0.1:3107, systemd `gosti`.
- CMS: PHP 8.4 FPM, Docker `gosti-php`, loopback9000; внутренний Nginx127.0.0.1:8108. Host PHP8.5 несовместим с закреплённой openspout, не использовать его для artisan.
- Текущий релиз frontend и CMS: `/var/www/gosti/releases/20260916-5`; `/var/www/gosti/current` — переключаемая ссылка. Постоянное storage остаётся в `/var/www/gosti/releases/20260909-1/cms/storage`.
- БД: /var/www/gosti/shared/database.sqlite. НЕ удалять релизы `20260915-1` и `20260909-1`, пока CMS и постоянное storage не перенесены отдельно с проверкой. Публичный storage:link сохраняет доступ к тем же загрузкам.

## Сеть и HTTPS

Сертификат Let's Encrypt покрывает tangerin.a-test.ru и www.tangerin.a-test.ru, первый срок — 08.12.2026. Файлы в /etc/letsencrypt/live/tangerin.a-test.ru/. certbot.timer включён; тестовое продление успешно выполнено. Проверка продления: `certbot renew --dry-run --no-random-sleep-on-renew`.

Nginx: /etc/nginx/sites-available/gosti. Правило CMS должно учитывать текущий маршрут Livewire и возможную смену хеша:

```nginx
location ~ ^/(admin|livewire(?:-[a-z0-9]+)?|api/content|up|storage|css|js|fonts)(/|$) {
    proxy_pass http://127.0.0.1:8108;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

Внутренний FastCGI получает HTTPS-признак через map только от loopback-прокси. APP_URL и FRONTEND_URL — основной HTTPS-домен; SESSION_SECURE_COOKIE=true. Signed /preview обслуживает Next, /api/preview извне закрыт; Next обращается к нему по внутреннему CMS_URL. ALLOW_INDEXING=false и X-Robots-Tag noindex сохраняются.

Вход по короткому логину задаётся парой CMS_ADMIN_LOGIN/CMS_ADMIN_EMAIL в закрытом серверном env. Пароли и ключи в репозитории не хранятся. Alias использует обычную авторизацию и ограничение попыток Filament.

## Выпуск и откат

1. Подготовить отдельный релиз с теми же lockfiles. При текущем выпуске зависимости скопированы hardlink без изменения; перед будущим npm ci/composer install создайте собственные новые каталоги зависимостей, не меняйте связанные файлы старого релиза.
2. Сохранить БД и env; сохранить доступ к постоянному storage. Не импортировать seed поверх рабочей базы и не публиковать чужие черновики.
3. Собрать с CMS_URL=http://127.0.0.1:8108, SITE_URL=https://tangerin.a-test.ru, ALLOW_INDEXING=false. Подготовить standalone/public и standalone/.next/static.
4. Через контейнер PHP выполнить `filament:assets`, затем `config:cache` и `route:cache` в новом каталоге CMS. До переключения проверить, что все CSS/JS URL из `/admin/login` отвечают `200`: одного Livewire JS недостаточно.
5. Переключить `current` атомарно, перезапустить `gosti` и `gosti-php` для очистки путей/OPcache.
6. Проверить HTTP/HTTPS, все assets админки, настоящий вход/выход, переключение пароля, контент и сайт на desktop/mobile. Один ответ `200` страницы входа не доказывает работоспособность формы.
7. При сбое вернуть `current` на предыдущий релиз и перезапустить процессы. БД не откатывать вслепую.

Systemd: /etc/systemd/system/gosti.service, Node .next/standalone/server.js от пользователя gosti. Команды: `systemctl status gosti nginx`, `docker logs gosti-php`.

## Выпуск посадочных страниц 16.09.2026

Активен `/var/www/gosti/releases/20260916-3`, исходный коммит `6ae83c496e8adf3c3ff659091e13f348c4bebc3b`. Выпуск добавил страницы `/doma/laym`, `/doma/limon`, `/doma/citrus` и `/dlya-bolshoy-kompanii`, а также их поля в CMS. Перед миграцией сохранена база `/var/www/gosti/backups/database-20260916-1951-before-house-landings.sqlite`.

После переключения проверены все пять публичных маршрутов, опубликованные записи API, `/admin`, десять Filament/Livewire assets, CSS/JS Next.js, изображения и `noindex`. Для отката frontend и CMS верните `current` на `/var/www/gosti/releases/20260916-1` и перезапустите `gosti` и `gosti-php`; базу откатывайте только после проверки изменений, внесённых после резервной копии.

## Выпуск путеводителя и терминологии 16.09.2026

Активен `/var/www/gosti/releases/20260916-5`, исходный коммит `7f99de2`. Выпуск добавил `/kostroma`, `/kostroma/gde-poest`, `/kostroma/dostoprimechatelnosti`, поля путеводителя в CMS и `ItemList` JSON-LD. Публичные «таунхаусы» заменены на дома; отдельный блок и пункт меню SPA удалены, баня дома «Лайм» находится среди услуг раздела «Всё для отдыха». Релиз `20260916-5` отличается от проверенного `20260916-4` только фирменным favicon.

Перед миграцией сохранена база `/var/www/gosti/backups/database-20260916-2248-before-kostroma-guides.sqlite`, права `600`; `PRAGMA integrity_check` после выпуска — `ok`. Проверены восемь публичных маршрутов, API CMS, admin login, Next/Filament assets и favicon через TLS-туннель. Browser QA на 320, 390, 768, 1265 и 1440 px не обнаружила переполнения, битых изображений, console/runtime errors или старой терминологии; noindex сохранён.

Для отката к коду до favicon верните `current` на `/var/www/gosti/releases/20260916-4` и перезапустите `gosti` и `gosti-php`. Для полного отката контентной миграции сначала проверьте изменения, внесённые после резервной копии, и восстанавливайте базу отдельно; миграцию вслепую не откатывать.

## Данные и проверки

Релиз4 добавляет /admin/visual-editor и signed /editor-preview. Сохранение через Livewire, права/CSRF/ревизии на сервере; данные не мигрировались и чужие черновики не публиковались. До переключения сделан pre-release4.sqlite. Typecheck/lint/verify:content/build, 15 PHP-тестов (68 assertions), локальный браузерный цикл правка → черновик → публикация → возврат исходного текста и desktop/mobile прошли. На домене проверены вход, загрузка редактора, выбор/предпросмотр/отмена и сохранение неизменённого текста. Неподписанный preview403; в публичном HTML нет редакторских маркеров и тестового текста.

Релиз3 меняет только CSS строки адреса: сплошной светлый фон, контрастный текст14px (13px mobile), адрес показан и на телефоне, шапка отодвинута ниже. Локальные проверки 320/390px и desktop прошли; контраст11,49:1.

32 опубликованные записи сохранены. Приблизительность площади Лимона перенесена из условия по цвету в поле areaApproximate; шесть дублировавших названия/вместимость текстов компании удалены из draft/published, поскольку теперь используются записи домов. Чужие черновики не выпускались.

Бэкапы: `/var/backups/gosti/20260909.sqlite` и `20260909.env`; снимки перед последними миграциями — `pre-release2.sqlite`, `pre-release-20260914-1.sqlite` и `pre-release-20260914-2.sqlite`. Соответствующие env сохранены отдельно. База снята `VACUUM INTO`, файлы имеют права `600`. Резервные конфиги Nginx находятся там же.

Проверены production build, typecheck/lint, регрессии сборщика и 10 PHP-тестов (40 assertions). Браузером: главная desktop/mobile, вход/выход, показ пароля и список CMS. Внешний HTTPS /admin/login через Ethernet дал200 с проверенным TLS-сертификатом. На текущем компьютере обычный VPN-маршрут всё ещё может зависать; браузерная QA использовала отдельный диагностический маршрут к тому же публичному443, сохраняя домен и проверку сертификата. Это не требование туннеля для других посетителей.

Архитектура и расширение: [technical-architecture](../nextjs/technical-architecture.md).

## Выпуск 10.09.2026

Активен frontend /var/www/gosti/releases/20260910-1, cms — ссылка на20260909-4/cms. Изменён только editorial.css: мобильный iframe бронирования вписан в симметричные отступы; заголовок и пояснения сайта центрированы. Данные CMS не менялись. Проверены320/390px, отсутствие горизонтального переполнения, build/typecheck/lint/verify:content и site/admin200. Откат frontend — на20260909-4. Внутренние стили Bnovo остаются на стороне провайдера.

## Выпуск 14.09.2026

Активен `/var/www/gosti/releases/20260914-1`, исходный коммит `7119865`. Релиз содержит production standalone-сборку и собственную копию CMS; постоянное хранилище по-прежнему связано с релизом1. Миграция `2026_09_14_000000_apply_client_content_review` обновила согласованные тексты и адрес, добавила опубликованный рейтинг Avito `4,7 · 116 отзывов` первым, переставила Яндекс Карты и 2ГИС и сняла Google Maps с публикации без удаления черновика.

Перед миграцией сохранены `/var/backups/gosti/pre-release-20260914-1.sqlite` и `/var/backups/gosti/pre-release-20260914-1.env`, права `600`. Старые релизы сохранены. Проверены миграция, config/route cache, `nginx -t`, локальные сервисы Next/CMS, HTTPS главной и `/admin/login`, публичный порядок рейтингов и отсутствие Google в API. Откат frontend — атомарно вернуть `/var/www/gosti/current` на `/var/www/gosti/releases/20260910-1` и перезапустить `gosti` и `gosti-php`; базу не откатывать без отдельной проверки, поскольку миграция сохраняет совместимую структуру и только меняет контент.

## Выпуск 15.09.2026

Активен `/var/www/gosti/releases/20260914-2`, исходный коммит `e44e84d`. Преимущества, баня, услуги, бронирование и FAQ собраны в цельные кремовые композиции; услуги используют фотографии из собственных CMS-записей. Растительный декор обрамляет светлые главы и не создаёт горизонтальное переполнение. Миграция `2026_09_14_130000_add_service_editorial_images` применена batch3; целостность SQLite — `ok`, четыре опубликованные услуги имеют изображения.

Перед миграцией сохранены `/var/backups/gosti/pre-release-20260914-2.sqlite` и `/var/backups/gosti/pre-release-20260914-2.env`, права `600`. Проверены candidate на отдельном порту, `nginx -t`, Next/CMS/API/HTTPS, статические assets и отсутствие ошибок в логах. После переключения обнаружено, что Filament assets не вошли в исходный архив; `filament:assets` опубликован из vendor, после чего все 10 CSS/JS URL админки отвечают `200`. Браузерная QA через временный Ethernet-туннель прошла на 1440/390/320 px без горизонтального скролла и console errors; показ/скрытие пароля работает, backend-проверка учётных данных и права панели вернула `AUTH_OK`. Откат frontend — вернуть `/var/www/gosti/current` на `/var/www/gosti/releases/20260914-1` и перезапустить `gosti` и `gosti-php`; базу не откатывать вслепую.

## Выпуск 16.09.2026

Активен `/var/www/gosti/releases/20260916-1`, исходный коммит `b0e89507257b5412e968731e20341a749974f963`. Изменена только frontend-типографика: увеличены вводный текст, заголовки, описания, характеристики и кнопки карточек домов, а также подписи блока большой компании. CMS, опубликованные данные и миграции не менялись; frontend-релиз ссылается на существующую CMS `/var/www/gosti/releases/20260915-1/cms`.

Перед переключением сохранены `/var/backups/gosti/pre-release-20260916-1.sqlite` и `/var/backups/gosti/pre-release-20260916-1.env` с правами `600`. Candidate проверен на `127.0.0.1:3117`, затем ссылка `current` переключена атомарно и `gosti` перезапущен. Проверены `nginx -t`, Next `3107`, CMS `8108`, публичные главная и `/admin/login`, два CSS-ресурса, `X-Robots-Tag: noindex` и meta noindex. Production-проверка на 320, 390, 768, 1024, 1440 и 2560 px не обнаружила горизонтального переполнения, выходящих за экран карточек или кнопок. Откат frontend — вернуть `/var/www/gosti/current` на `/var/www/gosti/releases/20260915-14` и перезапустить `gosti`; БД и CMS откатывать не нужно.
