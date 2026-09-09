# Развёртывание на VPS

09.09.2026. Сервер 186.246.50.205, Ubuntu 26.04. Выполнено первое развёртывание по IP по запросу пользователя; домен не назначен.

## Архитектура

- Nginx :80 → Next.js на 127.0.0.1:3107, systemd gosti.service.
- CMS: официальный PHP 8.4 FPM в контейнере gosti-php (порт только loopback 9000), Nginx внутренний 127.0.0.1:8108. PHP 8.5 из Ubuntu несовместим с закреплённой openspout.
- Код: /var/www/gosti/releases/20260909-1, текущая ссылка /var/www/gosti/current. БД: /var/www/gosti/shared/database.sqlite.
- Переносятся текущие локальные исходники и 32 опубликованные записи, без пользователей, паролей, сессий и локальной БД. Ключ Laravel создаётся на сервере.
- До домена и HTTPS: ALLOW_INDEXING=false, X-Robots-Tag noindex, вход admin/livewire/preview закрыт снаружи.
- SSH через локальный Ethernet relay; детали в локальном PROJECT_CONTEXT.md, секреты не сохраняются.

## Проверки

Локально прошли typecheck, lint, verify:content, 9 PHP-тестов (28 assertions). Production build прошёл на сервере. Next запускается через .next/standalone/server.js; public и .next/static скопированы в standalone.

Проверены публичный HTTP 200 напрямую через Ethernet, API/robots/sitemap/изображение 200, внешний /admin 403, внутренний /admin/login 200. Все 32 опубликованные записи совпадают с экспортом. Browser QA серверной версии через SSH-туннель: desktop1440/mobile390, меню, открытие ReservationSteps без брони; ошибок приложения нет. Через VPN прямой IP блокируется.

В обработчике CMS исправлен перехват служебного DYNAMIC_SERVER_USAGE: оборачиваются только TimeoutError/AbortError, остальные ошибки пробрасываются без изменений. Проверено изолированным тестом и production build.

## Эксплуатация

- systemctl status/restart gosti nginx; docker logs gosti-php.
- Конфиги: /etc/nginx/sites-available/gosti, /etc/systemd/system/gosti.service.
- Контейнер: gosti-php:8.4, официальный php:8.4-fpm-bookworm с intl, zip, gd, pdo_sqlite, opcache и Composer 2; /root/Dockerfile.gosti.
- Бэкап после развёртывания: /var/backups/gosti/20260909.sqlite и 20260909.env (600). База снята VACUUM INTO.
- Первый релиз: предыдущего приложения на сервере не было. Для отката будущего релиза переключать current и перезапускать gosti; БД/ключ сохранять отдельно, миграции не откатывать вслепую.
- Нужны домен и HTTPS перед открытием админки. Администратор CMS ещё не создан; root SSH не является аккаунтом CMS.
