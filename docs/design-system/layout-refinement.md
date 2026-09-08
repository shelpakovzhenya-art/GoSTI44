# Танжерин: читаемость, декор и контакты

Итерация 7 сентября 2026 по скриншоту пользователя. Стадия — локальная проверка дизайна, без публикации.

## Что изменено

- Основной текст 18–20 px на desktop и 17 px на телефоне. Преимущества: заголовки 18/17 px и описания 16/15 px вместо прежних 14/13 и 12/11. Увеличены подписи, ссылки, кнопки, отзывы и раскрываемые описания. Цвет вторичного текста темнее.
- В шапке desktop две строки: бренд, телефон, иконки связи и бронирование; ниже навигация 16 px. На телефоне иконки доступны постоянно, меню раскрывается отдельно.
- Пересобран блок преимуществ: заголовок без принудительных трёх строк, широкая читаемая сетка и самостоятельная композиция фотографии. Декор не перекрывает подпись к фото.
- Карточки домов растягиваются по содержимому, кнопки и метки выравниваются снизу. На планшете карточка горизонтальная, на телефоне вертикальная. Услуги: 4/2/1 колонки вместо узких карточек на телефоне.
- Добавлены лимонная ветвь и пальмовая листва. Вместе с мандаринами и цветущей веткой они используются в hero, рейтингах, домах, преимуществах, SPA, услугах, бронировании и футере. Все фотографии жилья и SPA остаются реальными.
- В шапке и футере — Telegram, ВКонтакте и маршрут в Яндекс Картах. Telegram и VK взяты из действующего сайта клиента (D:\Codex\cache\tangerine\client.html). Не добавлены неподтверждённые WhatsApp/Max.
- Карта перенесена в семантический footer и отображается без кнопки включения. Lazy iframe 475 px desktop / 380 px mobile, под ним адрес и маршрут. Исправлено наследовавшееся flex:1, сжимавшее iframe до 150 px.

## Карта и внешние данные

Карта привязана к существующей организации Яндекса 221989406502. Маршрут открывает координаты этой точки (57.744737, 40.965101). В интерфейсе Яндекса конечный пункт отображается как «Октябрьская улица, 45А», тогда как клиентский сайт указывает 47; это прежнее расхождение зафиксировано для сверки перед публикацией. Название организации в чужом виджете остаётся прежним. Исходная точка маршрута пользователем ещё не задана.

## Проверка

- Просмотрены 390, 1440 и 2560 CSS px: читаемость, выравнивание, декоративные края и фактическая карта в футере.
- Мобильное меню закрывается при переходе. Описание завтраков раскрывается. Диалог Лайма открывается, Escape закрывает его и возвращает фокус к кнопке.
- ESLint, verify:content и production build с TypeScript прошли. 17 реальных ассетов, 4 декоративных, 10 якорей, 3 карты, 23 слова цитат.
- Дополнительные детали — docs/pages/home/blocks/layout-refinement-smoke-check.md.
- Локальный preview: http://127.0.0.1:3107/ . Изменений бронирования/оплаты и публикации нет.

## Дополнительный декор: встроенный Imagegen

Оптимизированные ассеты: 
- `D:\Codex\workspaces\Tangerine\public\brand\lemon-branch.webp` — 165 632 байта.
- `D:\Codex\workspaces\Tangerine\public\brand\palm-frond.webp` — 199 752 байта.

Исходники сохранены в `D:\Codex\home\generated_images\01a07b07-2341-7521-bd28-303fe79274ea`; alpha сохранена при конвертации Sharp в WebP, высота 1000 px. Декор не изображает территорию клиента.

Промпт лимонов:
> Create a single premium botanical cutout illustration for a Russian holiday cottage website: a graceful curving citrus branch bearing two ripe yellow lemons, one small lime and delicate cream white citrus blossoms with rich natural olive-green leaves. Hand-painted botanical realism, detailed fine leaf veins, softly sunlit, elegant Mediterranean summer holiday mood, warm restrained colors, no background, genuine transparent alpha background, no ground shadow, no border, no text. Branch naturally arranged on a diagonal from lower left to upper right, contained entirely within image with generous transparent margin; airy elongated composition suitable as a corner ornament. No houses, no people, no landscape. Output one isolated ornamental branch only.

Промпт пальмовой ветви:
> Create a single elegant botanical cutout illustration of a sweeping palm frond for a premium summer retreat website. Natural muted olive and deep forest green leaflets, delicate hand-painted botanical realism, softly sunlit, graceful long arching stem curving diagonally from bottom right toward upper left, asymmetric airy silhouette with abundant space between leaflets. Genuine transparent alpha background, no white background, no ground shadow, no border, no text, no scenery, no people, no fruit. Keep complete frond inside canvas with transparent margins. Sophisticated quiet Mediterranean vacation mood, not cartoonish.

