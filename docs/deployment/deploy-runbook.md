# Развёртывание и эксплуатация — 09.09.2026

## Адреса и службы

- Сайт: https://tangerin.a-test.ru/ ; CMS: https://tangerin.a-test.ru/admin .
- HTTP, IP 186.246.50.205 и www перенаправляются на основной HTTPS-адрес.
- Nginx 80/443 → Next.js 127.0.0.1:3107, systemd `gosti`.
- CMS: PHP 8.4 FPM, Docker `gosti-php`, loopback9000; внутренний Nginx127.0.0.1:8108. Host PHP8.5 несовместим с закреплённой openspout, не использовать его для artisan.
- Текущий релиз: /var/www/gosti/releases/20260909-2; /var/www/gosti/current — переключаемая ссылка. Предыдущий /var/www/gosti/releases/20260909-1 сохранён.
- БД: /var/www/gosti/shared/database.sqlite. Хранилище CMS нового релиза ссылается на cms/storage первого релиза; НЕ удалять первый релиз, пока storage не перенесён отдельно с проверкой. Публичный storage:link сохраняет доступ к тем же загрузкам.

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
4. Через контейнер PHP выполнить config:cache/route:cache в новом каталоге CMS. Переключить current атомарно, перезапустить gosti и gosti-php для очистки путей/OPcache.
5. Проверить HTTP/HTTPS, Livewire JS, настоящий вход/выход, переключение пароля, контент и сайт на desktop/mobile. Один ответ200 страницы входа не доказывает работоспособность формы.
6. При сбое вернуть current на предыдущий релиз и перезапустить процессы. БД не откатывать вслепую.

Systemd: /etc/systemd/system/gosti.service, Node .next/standalone/server.js от пользователя gosti. Команды: `systemctl status gosti nginx`, `docker logs gosti-php`.

## Данные и проверка релиза 2

32 опубликованные записи сохранены. Приблизительность площади Лимона перенесена из условия по цвету в поле areaApproximate; шесть дублировавших названия/вместимость текстов компании удалены из draft/published, поскольку теперь используются записи домов. Чужие черновики не выпускались.

Бэкапы: /var/backups/gosti/20260909.sqlite и 20260909.env; снимок перед текущими миграциями — pre-release2.sqlite. База снята VACUUM INTO, файлы600. Резервные конфиги Nginx находятся там же.

Проверены production build, typecheck/lint, регрессии сборщика и 10 PHP-тестов (40 assertions). Браузером: главная desktop/mobile, вход/выход, показ пароля и список CMS. Внешний HTTPS /admin/login через Ethernet дал200 с проверенным TLS-сертификатом. На текущем компьютере обычный VPN-маршрут всё ещё может зависать; браузерная QA использовала отдельный диагностический маршрут к тому же публичному443, сохраняя домен и проверку сертификата. Это не требование туннеля для других посетителей.

Архитектура и расширение: [technical-architecture](../nextjs/technical-architecture.md).
