# Исправление наведения на Позвонить —30.10.2026
https://tangerin.ru/ — .contact-actions > .button.button-dark.
Причина: общий .button:hover svg сдвигал SVG, который в контактном ряду является целым оранжевым кругом; overflow старой кнопки обрезал круг. Переопределены transform/translate/rotate для SVG и transform/overflow/clip-path контейнера в normal/hover/focus/active; отключён старый декоративный before. При наведении осталось лёгкое затемнение SVG, без движения.
Проверка production: оба новых CSS загружены, hover overrides присутствуют в CSSOM, computed transform none/overflow visible/before none. Ссылки/текст/CMS/API/JS/Bnovo не менялись. Снимок proof/contacts.png. Runtime verification.json.
CSS1m2h-phone-hover-20261030.css иhome-only-phone-hover-20261030.css; manifest/Nginx ссылки обновлены. Backup /var/www/gosti/backups/20261030-phone-hover.
