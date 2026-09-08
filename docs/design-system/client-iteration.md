# Танжерин — клиентская итерация 07.09.2026

## Решение

Сохранена основа работающего лендинга: большой фотографический hero, широкий контейнер, чередование светлых и зелёных секций, карточки домов, галерея и отзывы. По трём присланным макетам добавлена цитрусовая айдентика: два мандарина, ТАНЖЕРИН, «место, где Вы дома», Cormorant Garamond в бренде и заголовках, Manrope в интерфейсе, молочный фон, оливковые поверхности, оранжевые CTA, ботанические ветви и плавная граница hero.

Пользователь отдельно подтвердил: использовать реальные фотографии клиента. Изображения чужих домов из макетов не используются. В официальном бронировании найдены настоящие фото бани и чайной зоны; добавлены в SPA, галерею и диалог Лайма.

## Контент клиента

- ЛАЙМ: 67 м², до 7 гостей, 2 спальни, 2 санузла, своё SPA.
- ЛИМОН: около 100 м², до 9 гостей, 2 спальни, гостиная, 2 санузла, джакузи.
- ЦИТРУС: около 97 м², до 10 гостей, 4 спальни, 3 санузла, отдельные кровати.
- Общая компания: до 25 гостей в трёх домах, как указано в клиентском макете. Сумма максимальных вместимостей карточек 26 не заменяет обозначенный клиентом общий лимит 25.
- Добавлены «Почему Танжерин», большая компания, SPA в Лайме, завтраки, мангал, детские принадлежности и дополнительный комфорт. Описания SPA и услуг раскрываются на странице.
- Клиентский макет принят источником новых названий и характеристик. Соответствие фото: прежний Семейный → Лайм, Бизнес → Лимон, Люкс → Цитрус по площади, спальням и бане.
- Рейтинги с макета не копировались: сохранены проверенные Яндекс, 2ГИС и Google с логотипами и ссылками.
- Приложение для заказа допуслуг не существует в этой реализации. CTA предлагает согласовать услуги после бронирования со Светланой; недействующая кнопка приложения не добавлена.

## Файлы и ассеты

- `src/components/brand.tsx`, `src/components/holiday-sections.tsx`, `src/app/tangerine.css` — новые компоненты и оформление.
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/components/navigation.tsx`, `src/components/houses.tsx`, `src/components/gallery.tsx`, `src/data/site.ts` — обновлённая страница, навигация, бренд и контент.
- Мандариновый знак: `D:\Codex\workspaces\Tangerine\public\brand\tangerines.webp`.
- Листва: `D:\Codex\workspaces\Tangerine\public\brand\citrus-leaves.webp`.
- Ассеты созданы встроенным Imagegen; WebP — оптимизация размера без изменения композиции, alpha сохранена. Два файла весят вместе около 339 КиБ. Исходные PNG остаются в `D:\Codex\home\generated_images\01a07b07-2341-7521-bd28-303fe79274ea`.
- SPA: `public/images/spa-sauna.jpg`, `public/images/spa-tea.jpg`; URL источников — `public/images/sources.json`, комната `182277` действующего модуля клиента.

## Промпты Imagegen

Знак, reference — присланный макет `codex-clipboard-891a62a6-3df5-435a-a66b-7e0520a5bf88.png`:

> Use case: background-extraction / logo-brand. Create a single clean reusable brand asset on a genuinely transparent background. Input image is a client website brand reference. Extract and faithfully recreate ONLY the small two-tangerine botanical illustration at the TOP LEFT of that screenshot: two ripe orange mandarins, one slightly behind the other, attached to a small curved twig with a handful of rich dark olive-green citrus leaves. Match the elegant realistic botanical watercolor / hand-painted style, warm orange peel texture and green leaf veins. Keep the two-fruit compact composition, front tangerine lower-right, rear fruit upper-left. NO TEXT, no typography, no white square, no scenery, no shadow floor. Square canvas approximately 1024px, fruits+leaves occupy 90% of canvas, generous clean alpha edges. This asset will be used next to a separately typeset Russian logo and enlarged as citrus decorative foliage in a summer holiday website. Do not include any elements of the website itself.

Листва, новая иллюстрация:

> Use case: illustration-story. Asset: decorative botanical corner cutout for a refined summer holiday lodge website called Tangerine. Generate a graceful airy branching sprig of real citrus foliage with 9 to 12 pointed elongated dark olive and sage green leaves, fine leaf veins, 2 tiny delicate white citrus blossoms with golden centers. NO FRUIT. Beautiful naturalistic antique botanical watercolor with subtle lifelike texture, elegant organic asymmetry, rich layered translucent greens. The twig sweeps diagonally from upper right to lower left, freely branching, with clear transparent space between individual leaves. Entire isolated branch on a GENUINELY TRANSPARENT ALPHA BACKGROUND, no white panel or paper. Square composition. All leaves inside canvas with margins, no cut edges, no lettering, no pots, no floor, no background, no drop shadow. Premium Mediterranean botanical feel, calm sunny garden vacation. Use for webpage corner accents over ivory and sand backgrounds, not a photo of a property.

## Render и проверка

Просмотрены реальные кадры 390×844, 1440×1000 и 2560×1440. Базовая компоновка на CSS, без изменения canvas после mount. Устранён горизонтальный overflow от ветви hero; декоративный мандарин в услугах помещён за контентом, чтобы не закрывать CTA. На финальных размерах overflow отсутствует. Разрешение CDP применялось временно для проверки конкретной вкладки; затем сброшено.

Проверены: мобильное меню и переход к услугам; раскрытие SPA и завтраков; диалог Лайма, новое имя и 5 фото, переход к спальне, Escape и возврат фокуса. Broken images: 0. ESLint, TypeScript в production build, статический экспорт и verify:content прошли. 17 реальных ассетов + 2 брендовых, 10 якорей, 3 площадки карт, 23 слова цитат.

Локальный preview: http://127.0.0.1:3107/ . Публикация не выполнялась. Следующее действие — правки пользователя по этой версии.
