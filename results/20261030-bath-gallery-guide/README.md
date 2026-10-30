# Исправления по скриншотам30.10.2026

В production https://tangerin.ru/:
- /vse-dlya-otdyha/banya-i-kupel: компактная карточка по приложению5 исходного письма;1040px, высота532→411px.4фото/тариф7700/3часа/6гостей сохранены. Просмотр фото1→2 проверен. В опубликованной и черновой версиях удалена запятая «баню, и»;2ревизии, точечныйbackup.
- /doma/laym,/doma/limon,/doma/citrus: снята фиксированная высота подписей. Проверены10/15/14подписей, обрезанных0.
- /kostroma и6подстраниц: единыйH1Cormorant500,56px;CSSmobile40px. Все7страниц проверены.
- «Смотреть рекомендации»: существующая прокрутка работала; добавлено видимое выделение целевого блока и scroll-margin. Проверено focus=guide-recommendations,scrollY342,targetTop240,без#вURL.

Desktop:overflow0 на10страницах. МобильныеCSSправила добавлены, но Chrome viewport override в этой проверке не изменил фактическую ширину; мобильный визуальный проход не заявляется.

ProductionCSS1m2h-bath-gallery-guide-v2-20261030.css;5manifest+nginx. Backup /var/www/gosti/backups/20261030-bath-gallery-guide. Старые исходники не собирались;Bnovo/JSне менялись. verification.json содержит измерения и хеши. Скриншот локально changes/20261030-bath-gallery-guide/proof/bath-desktop.png.
