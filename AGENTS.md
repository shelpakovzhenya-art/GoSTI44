# AGENTS.md

<!-- PROMPT_KIT:BEGIN managed version=0.12.0 -->

## Назначение

Prompt Kit помогает Codex разрабатывать сайты на Next.js: определить маршрут, загрузить только нужные правила и выполнить один проверяемый шаг. Базовый стек, если проект не задаёт другое: App Router, TypeScript, `src/`, компоненты и локальные проверки.

## Локальные правила проекта

- Правила сайта находятся после managed-блока или в `docs/project-rules.md`. Более узкое безопасное правило имеет приоритет; truth, permissions, safety, secrets и accessibility всегда побеждают любой override.
- `docs/project-state.md` и `docs/project-history.md` принадлежат только текущему сайту. Не переноси историю между проектами и в исходный kit.

## Четыре маршрута запроса

Сначала выбери один маршрут:

1. `status` — состояние или следующий шаг; читай только короткий `docs/project-state.md`.
2. `direct` — диагностика или локальная правка без смены стадии; читай затронутые файлы и один короткий стандарт.
3. `staged` — переход этапа; прочитай состояние, `prompts/ROUTER.md` и один выбранный промпт.
4. `cross-cutting` — Prompt Kit, CMS/архитектура, e-commerce, SEO или deployment; используй профильный маршрут, не меняя стадию без его требования.

`prompts/INDEX.md` — справочный каталог. Открывай его только при неоднозначном выборе внутри уже определённой стадии.

## Алгоритм работы

1. Определи маршрут, локальные правила, границы и разрешения.
2. Для `status/direct` сохрани стадию и используй минимальный контекст. Для `staged/cross-cutting` выбери один основной и максимум один необходимый вспомогательный промпт.
3. Открой выбранный промпт полностью и следуй `Ограничения`, `Процесс`, `Output` и `Done when`.
4. Не загружай будущие стадии и полные reference-базы заранее; полный compliance относится к critic/quality.
5. Проверяй пропорционально риску.
6. После значимого шага обнови `docs/project-state.md`. Если он больше `4096` байт, извлеки нужные разделы точечно; перед записью сохрани прежний текст без потерь в `docs/project-history.md` и замени снимок, не дописывая хронику.
7. Значимый подтверждённый результат — research, план, спецификация, аудит, статья или release evidence — сохрани в структурированном project-owned `.md` по canonical path текущего prompt; state хранит короткую ссылку, а не полный материал. Для простой `status`/`direct` задачи без нового артефакта файл не создавай.
8. Заверши понятным результатом. Крупный следующий этап требует подтверждения.

## Cross-cutting маршруты

- Prompt Kit update: `prompts/_maintenance/01-update-prompt-kit.md` → integrity → alignment; до preflight не меняй файлы и не меняй Git проекта.
- Source release: `prompts/_maintenance/05-release-prompt-kit.md`; build/verify не разрешает commit, tag, push и Release без явного разрешения.
- CMS: сначала выясни, кто меняет контент. Для владельца с Codex/ИИ CMS по умолчанию не нужна; для редакторов используй `prompts/06-nextjs-setup/02-technical-architecture.md`.
- E-commerce: перед каталогом, PDP, корзиной и checkout закрой operations/payment safety и review из `prompts/11-ecommerce/`.
- Technical SEO/deployment: используй technical SEO baseline, `prompts/12-deployment/` и оба SEO gate.
- SEO article использует `prompts/_content/01-write-seo-article.md`: SEO-угол → research pack `$article-researcher` → реестр `$article-fact-checker` → план/черновик `$seo-content-writer` → редактура → `$humanizer-ru` SEO → финальный контроль/Google Docs. Каждый этап запускается только явной просьбой; hero, CTA, карточки, формы и content preview используют `Site copy fast pass`.
- gpt-taste включается только явным route `page`, `block` или `component` для marketing/editorial задачи. Dashboard, checkout, forms, quality, SEO, deployment и maintenance не включают его автоматически.

## Всегда действующие ограничения

- Не придумывай факты, цены, отзывы, гарантии, юридические условия, наличие, сроки или бизнес-правила. Неподтверждённое помечай `needs confirmation`.
- Application API key/token настраивай по явной просьбе через `.prompt-kit/secret-input.mjs`: verified ignored env + скрытый terminal input; не проси значение в чат/args и не показывай. Root-пароли/private keys запрещены.
- Не выполняй destructive или внешние state-changing действия без ясного разрешения и точной проверки цели.
- Не добавляй зависимости, CMS, database, auth или сервис «на будущее» без подтверждённой необходимости.
- Не меняй соседнюю business logic, если задача локальная.
- Не объединяй стратегию, дизайн, реализацию, quality и deployment в один скрытый проход.
- Не выдавай lint/build или один открывшийся экран за проверку полного сценария форм, auth, CMS, commerce или интеграций.
- Не копируй чужой сайт или screenshot 1:1.
- Не утверждай visible UI без применимых browser/responsive/accessibility проверок из выбранного промпта.
- Не редактируй kit-owned промпты внутри пользовательского сайта вместо локального override: такие изменения создают update conflict.

## Язык и краткость

- Пользовательские ответы и человекочитаемые Markdown-документы по умолчанию пиши по-русски. Другой язык используй только по прямой просьбе или локальному правилу проекта. Код, пути, команды, API, названия технологий и машинные значения не переводи.
- Начинай с результата. Сохраняй только факты, решения, существенные оговорки и нужное действие. Убирай вступления, повторы, пустые разделы, внутреннюю кухню и необязательный фон.
- Промежуточное сообщение — до трёх коротких предложений. Для `status` и `direct` обычно достаточно `120` слов, для резюме `staged` и `cross-cutting` — `200`. Превышай ориентир только по просьбе пользователя или когда иначе потеряется важное доказательство, риск либо инструкция.
- По умолчанию ответ содержит результат и одно действие пользователя. Если действие не требуется, прямо скажи: `От вас ничего не требуется`. Не добавляй автоматически блоки `Зачем`, команду продолжения и служебный путь к промпту.
- В документах пиши каждое решение один раз, удаляй пустые неприменимые поля и ссылайся на источник вместо копирования его содержимого. Обычный отчёт или review ориентирован на `8 КБ`, спецификация или синтез — на `16 КБ`; большие доказательства и таблицы выноси отдельно.
- Полный `prompts/_knowledge/codex-user-response-quality.md` открывай только для сложного отчёта, блокера или неоднозначной передачи результата.

<!-- PROMPT_KIT:END -->

<!-- Project-specific context добавляется ниже этого комментария. Не помещай локальные правила проекта внутрь PROMPT_KIT managed-блока. -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Проект GoSTI44 / Танжерин — локальные правила

- Актуальные инструкции запуска: README.md; CMS.md, TRANSFER.md, DEPLOYMENT.md и SEO.md в docs. Стек Next.js + Laravel Filament подтверждён пользователем, повторного согласования CMS не требуется.
- Frontend в src/, backend в cms/, начальные данные в content/. Живой источник — опубликованные данные CMS. Не возвращайте static export и не подменяйте сбой CMS начальными данными на production.
- Бренд «ТАНЖЕРИН — место, где Вы дома». Только реальные фотографии клиента; не создавать вымышленные дома, отзывы, оценки, тарифы и условия. Домен отложен, не угадывать его.
- Новые строки интерфейса сайта подключать к системе редактирования контента. Проверять черновик → публикацию → отображение и восстановление. Поля CMS, которые не используются сайтом, не показывать редактору.
- Права публикации проверяются сервером. HTML очищается сервером. Не публиковать .env, БД, пользователей, пароли, uploads с приватными материалами, session context и исходные видео комментариев.
- Внешние бронирование и карты не принадлежат нашему backend. Не проводить реальные брони/платежи и не отправлять тестовые сообщения клиенту.
- Проверки: npm run verify:content, typecheck, lint, build; из cms — php artisan test. Изменения дизайна дополнительно проверить в браузере на ПК/мобильных ширинах. Не выдавать build за проверку UI.
- Пользователь явно разрешил публичный репозиторий GoSTI44 и полный переносимый проект. Исходный kit origin не является назначением публикации. Сначала проверить состав, секреты и чистую установку. Production deploy требует отдельного запроса.
- На этой машине новые изменяемые файлы только внутри D:/Codex, кеши в D:/Codex/cache, временные файлы в D:/Codex/temp. Защищённые исходники и историю не удалять ради освобождения места.
