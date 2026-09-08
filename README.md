# GoSTI44 — Танжерин

Сайт гостевых домов «Танжерин» в Костроме и CMS на Laravel Filament. Бренд: «ТАНЖЕРИН — место, где Вы дома». Домен пока не назначен.

## Состав

- Next.js 16.3.4 / React 19.2.8: лендинг, адаптивная версия, галереи, внешнее бронирование и карта.
- Laravel 12 / Filament 5: тексты, дома, услуги, удобства, фотографии, меню, страницы, SEO, отзывы и рейтинги; черновики, публикация, история и роли.
- SQLite для локальной работы; миграции и начальные данные входят в репозиторий.
- Реальные фото находятся в public/images, оформление бренда — public/brand. Происхождение: [источники контента](docs/content-sources.md).

## Требования

Node.js 22+, npm, PHP 8.2+, Composer 2, Git. Проверено на Node 25.8.1, PHP 8.2.31 и Composer 2.10.3. PHP-расширения: curl, dom, fileinfo, gd, intl, mbstring, openssl, PDO, pdo_sqlite, sqlite3, sodium, xml, zip.

На Windows размещайте рабочую копию в D:\Codex\workspaces. Кеш npm направлен в D:\Codex\cache\npm. При работе на другой ОС измените cache в .npmrc на существующий разрешённый путь.

## Первый запуск

Клонируйте [публичный репозиторий GoSTI44](https://github.com/shelpakovzhenya-art/GoSTI44):

```powershell
git clone https://github.com/shelpakovzhenya-art/GoSTI44.git
cd GoSTI44
```

Затем из его корня:

```powershell
npm ci
Copy-Item .env.example .env.local
cd cms
composer install
Copy-Item .env.example .env
php artisan key:generate
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate
php artisan db:seed --class=SiteContentSeeder
php artisan storage:link
php artisan filament:assets
php artisan cms:admin
```

Последняя команда запрашивает имя, email и пароль скрытым вводом. Общего пароля в репозитории нет. Повторный seed сохраняет уже существующие записи.

Откройте два терминала:

```powershell
# Терминал 1, корень проекта
npm run dev
```

```powershell
# Терминал 2, каталог cms
php artisan serve --host=127.0.0.1 --port=8107
```

Сайт: http://127.0.0.1:3107 . Админка: http://127.0.0.1:8107/admin . В .env.local указан CMS_URL. База и фото постоянны между запусками. Без запущенного CMS сайт сообщает ошибку, а не подменяет опубликованную версию начальными данными.

Для отдельного просмотра дизайна без CMS можно явно задать CONTENT_SOURCE=seed и убрать CMS_URL из .env.local. Этот режим не предназначен для production.

## Проверки

```powershell
npm run verify:content
npm run typecheck
npm run lint
npm run build
cd cms
php artisan test
```

Сборка использует server runtime (output: standalone), а не прежний static export. Для production нужны Node и PHP. Папка out из старого прототипа не является актуальной сборкой.

## Документация

- [Работа редактора и возможности CMS](docs/CMS.md)
- [Архитектура и структура кода](docs/nextjs/technical-architecture.md)
- [Перенос, резервная копия и восстановление](docs/TRANSFER.md)
- [Развёртывание на сервере](docs/DEPLOYMENT.md)
- [SEO и подключение домена](docs/SEO.md)
- [Результаты проверок](docs/QA.md)
- [Комментарии из видео](docs/video-review-2026-09-08.md)
- [Источники фотографий и фактов](docs/content-sources.md)
- [Правила работы с проектом](AGENTS.md)

Бронирование и платежи обслуживает существующий ReservationSteps. Отзывы Яндекс Карт подключены виджетом, рейтинги — проверенный вручную снимок с датой. CMS не синхронизирует наличие домов и оценки карт автоматически.

Исходный [Web Kit](https://github.com/dmandrianov/codex-web-kit-nextjs) сохранён вместе с лицензией; его исходное описание находится в [WEB-KIT-README.md](docs/WEB-KIT-README.md).

Служебные GitHub Actions исходного Web Kit архивированы в docs/legacy: они выпускают сам kit, а не сайт. Проверки приложения выполняются командами выше.
