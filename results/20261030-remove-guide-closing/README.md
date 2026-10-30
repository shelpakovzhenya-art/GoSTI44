# Удаление тёмного заключительного блока —30.10.2026
Удалён section.detail-closing.guide-closing из общего SSR-шаблона6внутренних страниц раздела /kostroma. Production — источник правки;2текущих компонента провереныSHA, сохранены в backup, заменено ровно одно JSX-выражение в каждом, node--check успешен. Пересборки старого исходника не было.
Проверены все7URL раздела:HTTP200,тёмныхзаключительныхблоков0,карточки основного содержания сохранены. Главная /kostroma не имела такого блока; её светлый gr-plan сохранён. CMS/API/CSS/Bnovoне изменены.
Backup:/var/www/gosti/backups/20261030-remove-guide-closing.
Runtimea87e6a7bfd7a368f030b5df3375378b936327d65d68ae05dac1190fd14ceafac. ПроверкиURL в verification.json; точечный воспроизводимый patch в apply.py/targets.json.
