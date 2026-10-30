# Задачи — Гостевой дом 44

Активных задач в Orca пока нет. При создании задачи записать коротко: название, чат/ветка, состояние, критерий готовности. Завершённые результаты сохранять в актуальном контексте проекта.

Для обычных последовательных задач достаточно отдельного чата. Для одновременных правок одного репозитория нужна отдельная рабочая копия Git.

- [x] github-sync-20261022: подключён существующий GitHub-вход; контекст и правила синхронизации сохранены в https://github.com/shelpakovzhenya-art/GoSTI44 (`orca/workspace/gosti44`). Исходники/материалы сохраняются отдельно по GITHUB_SYNC.md.

- [x] readiness-check-20261022: подтверждены13 групп ТЗ и последние комментарии клиента. Read-only проверка: API совпал с последним снимком; условия на https://tangerin.ru/dlya-komandirovochnyh после коллег, отмеченная пара фото на https://tangerin.ru/dlya-bolshoy-kompanii удалена; обе страницы200,5 страниц услуг и посуточное SEO питомцев сохранены. Production не изменялся. Передача владельцев GSC/Вебмастера — отдельное незавершённое действие. Предыдущие полные QA: source/changes/20261021-tz-recheck/REPORT.md и source/changes/20261021-business-followup/REPORT.md.

- [x] compact-business-children-20261022: опубликовано — фото завтрака в условиях удалено, блоки командировок компактнее, заключительный текст заменён; у детей удалены2 повторные подписи, цены/вещи/контакты сохранены. QA10 видов320–1920 и4 сценария/Bnovo/SSR без overflow/errors;2 body/4 ревизии,57 прочих строк сохранены. Проверенные изменения и доказательства: results/20261022-compact-business-children/README.md. GitHub synchronization records this completed result.

- [x] booking-bath-20261022: на production ранняя загрузка Bnovo, исправлены пропадание footer-формы при SPA главная→дом и stale iframe callbacks; баня24px/22px.23 страницы/60 сценариев desktop/mobile,4 действия гостей и5 ширин бани без ошибок.8 runtime-файлов,59 CMS-строк/API сохранены,0 ревизий. Проверенный код и доказательства: results/20261022-booking-bath/README.md.

- [x] kazan-booking-flow-20261022: казан перенесён в готовый комплект, нижний повтор удалён.1 body published/draft,2 ревизии,58 прочих строк и runtime сохранены;1920/390 проверены. Bnovo read-only: UID совпал, модуль включён, существующая бронь из модуля есть. По решению пользователя подключение общее с прежним сайтом; настройки не менять. Новый тестовый заказ/доставка уведомления не проверены. Результат: results/20261022-kazan-booking-flow/README.md.

- [ ] avito-link-20261022: диагностика завершена, замена ожидает актуальный URL клиента. Старый профиль в2 настройках/3 SSR-ссылках, по скрину «Пользователь не найден»; прямой Avito заблокирован site-safety, обходов нет. Production не менялся. Результат: results/20261022-avito-link/README.md.

- [x] company-closing-20261022: новый текст «…даты поездки — поможем подобрать размещение», closing уплотнён321→142px desktop/387→316px mobile.6 ширин320–1920,4 кнопки48px, CTA без# и Bnovo проверены.1 body/2 ревизии,58 прочих CMS-строк сохранены; CSS+5 manifests. Доказательства: results/20261022-company-closing/README.md.

- [x] company-recheck-20261022: read-only проверка новых снимков — в них прежний текст/оформление; свежий production/API/CSS актуальны. Дополнительно4 ноутбучных размера1024–1366:142–185px,4 контакта/форма без overflow. Production не менялся. Результат: results/20261022-company-recheck/README.md.

- [x] contacts-spacing-20261022: отступ H1→контакты72→20px, карточки/секции уплотнены;320px три соцсети в ряд.6 ширин320–1366 без overflow, тексты/телефон/email/карта и Bnovo сохранены. CSS+5 manifests,59 CMS-строк/API неизменны,0 ревизий. Доказательства: results/20261022-contacts-spacing/README.md.

- [x] footer-booking-cta-20261022: повторный оранжевый CTA удалён из общего футера; форма/UID/контакты сохранены.23 SSR200, завтраки1366/390 и главная/SPA→Лайм: Bnovo виден, overflow/errors нет.1 CMS body/2 ревизии,58 других строк и runtime без изменений. Результат: results/20261022-footer-booking-cta/README.md.

- [x] footer-booking-cleanup-20261022: убраны оставшийся footer-пункт «Проверить даты» и helper из footer/главной.23 SSR200, формы1366/390 видны, overflow нет;2 записи/4 ревизии,57 других строк/runtime сохранены. На холодной главной отмечен hydration warning418 без установленной причины, на завтраках чисто; подробности results/20261022-footer-booking-cleanup/README.md.

- [x] daily-log-20261022: подготовлен отчёт за22.10.2026,180 минут по пользователю, по SEO-РТ-001 v2.2 пп.12.5/13.6. Внедрение/проверка/ожидаемые действия разделены, Авито/новая бронь/React418 не выданы за решённые. В Битрикс24 не публиковался, production не менялся. Текст и источники: results/20261022-daily-log/REPORT.md.

- [x] limon-sofa-20261022: в кухне-столовой Лимона «Односпальный раскладной диван» вместо двуспального.1 body/2 ревизии,58 других строк/runtime сохранены;3 SSR домов и390/1366 без overflow/errors. Отчёт: results/20261022-limon-sofa/README.md.

- [x] faq-legal-20261022: FAQ→«Частые вопросы», оформление по референсу, меню21 пункт/FAQ вне правовых ссылок; legal2 карточки. Исправлено перекрытие меню Bnovo.23 SSR200,6 ширин/ответы/keyboard/меню/cookies/документ/Bnovo;3 записи/6 ревизий,56 других строк сохранены.10 runtime-файлов, SDK/CMS-code/ответы/документы прежние. Результат: results/20261022-faq-legal/README.md.

- [x] contacts-typography-20261023: контакты приведены к2 семействам/3 размерам (32/24/16px mobile,40/28/18px desktop); адрес/телефон/email/подписи едины. Production320/390/768/1366 без overflow/errors,3 соцсети в ряд, Bnovo готов;23 SSR200. CSS+5 manifests,59 CMS-строк/API неизменны,0 ревизий. Результат: results/20261023-contacts-typography/README.md.

- [x] avito-link-20261026: опубликован https://www.avito.ru/brands/i88220667 в двух настройках published/draft. API/3 href главной проверены;57 других строк сохранены,4 ревизии. results/20261026-avito-link/README.md.

- [x] house-cards-20261026: кнопки каталога44px, площадь без переноса, сравнение каждого дома показывает только2 других.6 ширин/3 дома/23 SSR200/бронирование проверены.3 CMS-строки/6 ревизий,56 других строк сохранены; CSS+5 manifests. results/20261026-house-cards/README.md.

- [x] children-booking-footer-20261026: страница с детьми по референсу; компактный футер; горизонтальный Bnovo desktop/все поля mobile и второй виджет перед преимуществами.2 CMS/4 ревизии,57 других записей сохранены;23 SSR200/адаптивность/календарь/гости/SPA проверены. https://tangerin.ru/vse-dlya-otdyha/s-detmi и https://tangerin.ru/#booking-top . results/20261026-children-booking/README.md.

- [x] children-reference-correction-20261026: исправлены hero/отступы/плашка цены/список3+2/цитрусовый декор, убраны лишние back-строки. https://tangerin.ru/vse-dlya-otdyha/s-detmi .4 ширины/Bnovo/HTTP/SHA проверены; CMS/API без изменений. results/20261026-children-reference/README.md.

- [x] children-booking-design-20261026: блок бронирования вписан в референс, заголовок слева/форма2×2, отступы/мобильная компоновка/календарь/гости/SPA проверены. https://tangerin.ru/vse-dlya-otdyha/s-detmi#footer-booking .7 runtime-путей, CMS/API неизменны. results/20261026-children-booking-design/README.md.

- [x] client-recheck-20261026: повторно сверены сегодняшние комментарии на production,23 HTTP200, карточки/Авито/3 сравнения/футер/виджеты/дети подтверждены. Визуальная приёмка возможна с оговорками: не точная копия референса, повторно зарегистрирован React418 без видимого сбоя; Авито-профиль/PMS-заказ не проверялись. results/20261026-client-recheck/README.md. Production без изменений.

- [x] react-hydration-20261026: исправлена гонка вставки Яндекс iframe до React commit. Старый порядок воспроизведён lifecycle-тестом; новый проходит8 сценариев, повторные загрузки/SPA/карта/отзывы/Bnovo/390/23 HTTP200 проверены без новых ошибок. https://tangerin.ru/ и https://tangerin.ru/vse-dlya-otdyha/s-detmi .7 runtime-путей, CMS/API неизменны. results/20261026-react-hydration/README.md.


- [x] legal-documents-mail-20261028: получены6 DOCX из Downloads, опубликованы5 документов и выполнены все пункты правок: баня/Лайм/галерея/компактный footer/9 FAQ.25 HTTP200, все абзацы/5 SHA загрузок/6 правовых ссылок проверены.21 CMS изменена/5 создано/52 ревизии/13 runtime-путей. Браузерный визуальный прогон недоступен; оригиналы DOCX сохранены отдельно от2 исправлений HTML. Ссылки и точный checklist: results/20261028-legal-documents/README.md.

- [x] legal-recheck-20261028: повторно сверены6 DOCX/25 страниц/184 абзаца/9 FAQ/5 загрузок/23 фото. Найдены и исправлены2 ошибки: обёртка нарушала FAQ details>p и старый CSS сохранял карточки правовых ссылок. Опубликованы JS/SSR+CSS,8 уникальных runtime-путей;64 CMS-строки/API неизменны/0 ревизий. Визуальный browser-run недоступен; исходные DOCX с авторскими несостыковками сохранены. Все ссылки и проверки: results/20261028-legal-recheck/README.md.

- [x] final-legal-audit-20261028: устранены5 текстовых расхождений в3 публичных DOCX и ссылка оферты в HTML;5 подписей скачивания уточнены, оригиналы Downloads сохранены.25 HTTP200/9 полных FAQ/184 абзаца5 документов/5 SHA проверены.3 runtime-файла,5 CMS-страниц/10 ревизий,59 прочих строк сохранены. Браузер/постраничный Word недоступны, визуальную приёмку не заявлять. Все ссылки и доказательства: results/20261028-final-legal-audit/README.md.

- [x] client-items-audit-docx-20261028:41 критерий присланного «правки.docx»/25 URL/9 FAQ/184 абзаца/5 загрузок/23 реальных фото проверены. Исправлен пропуск compact bath closing: прежний CSS10ID оставлял ветку/линию/padding150px; scoped11ID override опубликован.6 runtime-путей,0 CMS-изменений/64 строки сохранены. https://tangerin.ru/vse-dlya-otdyha/banya-i-kupel#bath-booking . Доказательства: results/20261028-client-items-audit/README.md.
- [x] client-items-audit-mail-scope-20261028: пользователь подтвердил, что весь список содержится в «правки.docx», дополнительных пунктов в письме нет. Полнота источника подтверждена; все41 критерий выполнены, сверка закрыта. Письмо/новый браузерный прогон не выдаются за проверенные. Отчёт: results/20261028-client-items-audit/README.md; готово к проверке клиента.

- [x] work-log-120min-20261028: прочитан актуальный регламент v2.2,пп.12.5/13.6; создан и проверен native Google Doc отчёта за28.10 с общим временем120 минут по указанию пользователя. Внедрённое/проверенное/ограничения/следующий шаг отражены отдельно; время по подзадачам не выдумывалось. https://docs.google.com/document/d/1uY3VC8-RCn-1Qgz9faVTeQ5sO5_F5M6zzn34IXJLwNM/edit . В Битрикс24 не публиковался. Локальная запись: results/20261028-work-log/report.txt и verification.json.

- [x] legal-footer-layout-20261028: по скриншоту воспроизведён пропуск внешней сетки footer (документы139.5px при1200px). Исправлено: heading full-width, контакты/документы рядом desktop,1 колонка mobile. Production6 ширин1920–320/снимки/overflow0/cookies/переход правил/SPA проверены.1366: высота446.5→183.5px.25 HTTP200,64 CMS-строки/API неизменны/0 ревизий,6 runtime-путей. https://tangerin.ru/#documents-and-contacts . Доказательства: results/20261028-legal-layout/README.md.

- [x] bath-spacing-20261028: по3 скриншотам убраны разрывы hero/цены/карточки/closing, уплотнён booking.1366 main1225→891px, карточка528→361px. Production6 ширин/снимки/2 photo-modal/календарь+гости1366/390/SPA проверены, overflow0/console0.25 HTTP200,64 CMS-строки/API неизменны/0 ревизий,6 runtime-путей. https://tangerin.ru/vse-dlya-otdyha/banya-i-kupel . Доказательства: results/20261028-bath-spacing/README.md.

- [x] bnovo-reliability-20261029: исправлен sticky script/ложная готовность пустого iframe; общий загрузчик с таймаутами/3 повторами/manual-online/fallback. https://tangerin.ru/vse-dlya-otdyha/zavtraki и https://tangerin.ru/ .12 сценариев/25 HTTP200/SHA/две формы/SPA/поиск/mobile390 проверены.6 runtime-путей;64 CMS строки/API неизменны. results/20261029-bnovo-reliability/README.md.


- [x] mail-client-20261029: опубликованы правки нового ТЗ:6 компактных контактных плашек,удаление повторов,карточки/галереи/новые фото,баня4 фото,WhatsApp/личныйTelegram/ОК https://ok.ru/group/70000044385070.23 CMS/48 ревизий,41 другая строка сохранена;14 изображений −1,44МБ,отложенное видео,ARIA/securityheaders/CSPReportOnly.25URL/assetSHA,Chrome320/390/1366,Bnovo поиск проверены. Ограничения:PageSpeed429,реальныеSafari/Android,контрольная бронь/PMS/уведомления и кабинеты поисковиков не проверялись. results/20261029-mail-client/README.md.

- [x] 2026-10-30: финальная подпись фото Лимона исправлена по изображению; API/SSR/ОК проверены,63 другие CMS-строки сохранены. https://tangerin.ru/doma/limon
- [x] 2026-10-30 production recheck: каждый пункт двухDOCX сверён; H1бани исправлен в проде56/40px. Визуальныеправки опубликованы; технические пункты частично открыты, включаяsrcset/sizes/LCP/полнуюбронь/реальныеустройства. results/20261029-mail-client/RECHECK-20261030.md

- [x] 2026-10-30 technical implementation: responsive images133/21, hero/video, HTTP2, CSS, accessibility100,25URL/26viewport QA, GSCsitemap success25. Production/local SHA verified. User excludes test booking and will test phones. LCP5.8→4.6s devtools; target2.5s not reached. Yandex sitemap read-only at service. results/20261030-technical-completion/README.md
`n- [x] 2026-10-30 remove video control: deleted Pause/Watch button SSR+CSR on production;390/1366/SSR verified. Background autoplay restored; CMS unchanged. results/20261030-remove-video-button/README.md

- [x] 2026-10-30 contact row:5 icons/labels aligned on production,320/390/1366 verified; CMS/JS unchanged. results/20261030-contact-row/README.md

- [x] 2026-10-30 phone hover: fixed inherited SVG translation/clipping on production; CSSOM/computed styles/API verified. results/20261030-phone-hover/README.md

- [x] 2026-10-30 business compact: corrected inconsistent colleagues/conditions/contact blocks on production,desktop1200x117.89px each;320/390 checked; CMS unchanged. results/20261030-business-compact/README.md

- [x] 2026-10-30 business features: cards321.5→168.19px on production;1366/390/320 verified, text/API unchanged. results/20261030-business-features/README.md

- [x] 2026-10-30 feature icon spacing:36px border-box and14px measured gap on1366/390/320; production verified. results/20261030-feature-icon-gap/README.md

-30.10.2026: production — компактная баня/запятая,39подписей галерей безобрезки,7H1Костромы,выделение цели рекомендаций. results/20261030-bath-gallery-guide/README.md.

-30.10.2026: удалён тёмный финальный фотоблок разделаКострома вproduction;7URLпроверены. results/20261030-remove-guide-closing/README.md.

-30.10.2026: первые блокиКостромыкомпактнее,production;results/20261030-guide-hero-compact/README.md.

-30.10.2026: карточки6страницКостромыкомпактнее;удалёнблоксоветаодороге;production. results/20261030-guide-cards-compact/README.md.

-30.10.2026: production—локальнаясервернаяформабронированиябезожиданияSDK;25URL/поискBnovoдат/гостей/SPAпроверены,беззаказа. results/20261030-booking-native/README.md.

-30.10.2026: датыбронированиясерверные,25URL+3проблемныхстраницыпроверены. results/20261030-booking-date-defaults/README.md.

-30.10.2026:Лимон2подписи,Парная12мфотообщейгалереи;production. results/20261030-gallery-labels-sauna/README.md.

-30.10.2026:вёрсткаобщегобронированияисправленаproduction;results/20261030-booking-layout/README.md.

-30.10.2026:уменьшенконтактныйтелефонглавнойдо20px,production. results/20261030-contact-phone-size/README.md.
