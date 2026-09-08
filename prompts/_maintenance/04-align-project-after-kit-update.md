# Синхронизировать проект после обновления Prompt Kit

## Когда использовать

После успешного `prompts/_maintenance/01-update-prompt-kit.md` и passed `prompts/_maintenance/02-check-kit-integrity.md`, когда incoming manifest уже стал installed `.prompt-kit/manifest.json` и нужно понять, как новая версия workflow соотносится с текущим состоянием проекта.

Этот prompt автоматически завершает одну update-транзакцию после команды `обнови базу`. Дополнительное подтверждение для самого alignment не требуется. Если версия не изменилась и свежий alignment уже соответствует installed manifest, повторный alignment не нужен.

## Роль Codex

Ты действуешь как workflow migration analyst, project state auditor и аккуратный product/process lead.

## Цель

Создать `docs/prompt-kit-workflow-alignment.md`: карту совместимости между установленным GitHub Release Prompt Kit и уже выполненными проектными этапами. Не откатывать проект автоматически, а объяснить, какие новые или изменённые возможности:

- уже покрыты существующими артефактами;
- требуют маленькой миграционной прокладки;
- стоит предложить пользователю как optional refresh;
- действительно требуют повторного прохода;
- можно безопасно оставить как есть.

## Контекст, который нужно дать

- Installed `.prompt-kit/manifest.json`.
- `.prompt-kit/CHANGELOG.md`.
- `.prompt-kit/MIGRATIONS.md`.
- `.prompt-kit/TERMS.md` с MIT License по legacy compatibility path.
- `docs/prompt-kit-update-summary.md`.
- `docs/prompt-kit-integrity.md` со status `passed`.
- `docs/project-state.md`.
- `project-brief.md`, если есть.
- Текущий `AGENTS.md` после managed-block merge.
- `prompts/ROUTER.md` и `prompts/INDEX.md`.
- Предыдущий `docs/prompt-kit-workflow-alignment.md`, если есть.
- Ключевые project-owned документы: `docs/strategy.md`, `docs/research/`, `docs/ia/`, `docs/design-system/`, `docs/nextjs/`, `docs/pages/`, `docs/ecommerce/`, `docs/deployment/`, `docs/seo/`, если они есть.
- Legacy root version/changelog/migrations используй только как fallback evidence для from-version первого перехода; installed truth после `0.5.0` берётся из `.prompt-kit/manifest.json`.

## Ограничения

- Не запускай alignment, если integrity не passed или installed manifest ещё не зафиксирован updater.
- Не откатывай проект на более раннюю стадию только потому, что новый release добавил промежуточный артефакт.
- Не запускай заново strategy, research, IA, design system, setup, page planning, SEO или deployment без явного подтверждения пользователя.
- Новый SEO-маршрут не запускай для существующей статьи автоматически: предложи только следующий явно выбранный этап с компактным handoff.
- Команда `обнови базу` разрешает анализ и обновление alignment/state reports, но не разрешает автоматически выполнять optional refresh.
- Не переписывай project docs массово.
- Не меняй `src/`, production UI, зависимости, env, server settings или пользовательские материалы.
- Не считай отсутствие нового артефакта ошибкой, если более поздние подтверждённые документы или код доказывают, что смысл уже покрыт.
- Не откатывай approved concept, Design ready или готовый UI только из-за отсутствия новых creator/critic или stable/provisional labels. Новый loop применяется к следующей реальной визуальной задаче.
- Не скрывай полезные новые возможности: предложи их понятным optional refresh с ценой и риском.
- Не меняй `.git/`, remotes, branches, hooks, commits или history. Alignment не требует Git mutations.
- Не перезаписывай installed manifest, release history или migrations.
- Не сохраняй GitHub credentials, token environment или персональные данные доступа в alignment/project state. Зафиксируй только безопасный access status при необходимости.
- Сообщения пользователю оформляй по `prompts/_knowledge/codex-user-response-quality.md`.

## Процесс

1. Проверь maintenance prerequisites:
   - update summary status `updated`;
   - integrity status `passed`;
   - `.prompt-kit/manifest.json` содержит target version из summary;
   - manifest numeric repository ID совпадает с embedded updater trust anchor, remote release/asset attestation прошла до extraction, а MIT License в `.prompt-kit/TERMS.md` прошла integrity;
   - managed marker `AGENTS.md` совпадает с target version.
   Если любое условие не выполнено, вернись в update/integrity и не создавай фиктивный alignment.
2. Определи from/to versions из update summary, installed manifest, namespaced changelog и migrations.
3. Прочитай `docs/project-state.md` и определи реальную текущую стадию проекта по evidence, а не только по missing files.
4. Извлеки из changelog/migrations только новые или существенно изменённые workflow areas диапазона from -> to. Не анализируй повторно всю историю kit без необходимости.
   - Для `0.12.0` зафиксируй установленный staged article workflow и папку `docs/seo/articles/<slug>/` как `covered`; не создавай research, реестр, план, черновик, Humanizer или Google Doc без отдельной просьбы.
5. Для Next.js technical architecture и responsive-delivery изменений отдельно проверь evidence:
   - кто меняет контент после запуска и обоснован ли текущий CMS/no-CMS выбор;
   - зафиксированы ли framework/runtime versions, hosting shape, sources of truth, data/cache freshness, public endpoints и critical scenarios;
   - есть ли для магазина commerce operations/payment safety, а для динамического project handoff — application flow evidence;
   - есть ли `layout-rules.md`, styling foundation, отсутствие viewport-dependent initial render branch, reserved media geometry и fresh-load browser verification.
   Не добавляй CMS или инфраструктуру автоматически и не откатывай завершённые стадии. Settled screenshots сами по себе не считаются полным responsive покрытием.
6. Для Creator-Critic Design Loop отдельно проверь:
   - может ли существующий Visual North Star служить positive creator evidence;
   - можно ли считать approved brand/type/color/action/accessibility/product patterns stable vocabulary;
   - есть ли смысл предложить targeted concept refresh или calibration одного слабого marketing chapter;
   - не требуется ли только начать новый loop со следующей visual task без переписывания старых docs/UI.
   Не запускай redesign автоматически и не требуй терминологической миграции ради самой терминологии.
7. Для gpt-taste integration отдельно проверь:
   - есть ли в существующем проекте approved concept, который уже явно создан gpt-taste;
   - можно ли создать `docs/design-system/gpt-taste-profile.md` только из подтверждённого evidence;
   - стоит ли предложить `page`, `block` или `component` mode для следующей новой expressive task.
   Не назначай skill старому UI задним числом, не создавай profile из догадок и не запускай redesign автоматически.
8. Для каждого изменения найди project evidence:
   - более поздний approved artifact;
   - review verdict;
   - принятое решение;
   - уже реализованный код;
   - explicit skip пользователя.
9. Присвой каждому area один status:
   - `covered` — смысл уже покрыт;
   - `migration artifact created/needed` — нужен маленький мостик;
   - `optional refresh` — улучшение полезно, но не обязательно;
   - `recommended rerun` — старый результат явно слабый или конфликтует с новой логикой;
   - `blocked` — нужен пользователь или внешние данные.
10. Если нужен безопасный migration artifact, создавай его только точечно и только из существующего evidence. Не выдумывай новые продуктовые, дизайнерские, коммерческие или технические решения.
11. Сформируй optional refresh offers:
   - человеческое название результата;
   - зачем это может помочь;
   - примерная цена по времени/риску;
   - точный prompt;
   - естественная команда пользователя.
   Не запускай ни один offer автоматически.
12. Если существующему проекту не хватает нового technical architecture artifact, предложи `06/02-technical-architecture` как optional refresh без автоматического изменения кода. Для visible UI без first-frame evidence предложи targeted refresh: сначала `05/09` для contract при необходимости, затем `06/04` для foundation и `09/05` для fresh-load verification. Не запускай автоматически и не откатывай project stage.
13. Для design workflow предлагай только один уместный optional refresh: новый concept через `05/03`, gpt-taste mode для следующей новой expressive task или calibration слабого marketing chapter. Не предлагай массовый redesign.
14. Определи `Recommended next prompt after alignment`. Он должен продолжать реальную работу проекта и не подменяться новым optional feature только потому, что kit обновился.
15. Создай или обнови `docs/prompt-kit-workflow-alignment.md`.
16. Обнови `docs/project-state.md`:
    - installed kit version и release tag;
    - last kit update date;
    - workflow alignment status;
    - link на alignment report;
    - сохранённую реальную project stage;
    - recommended next prompt;
    - optional refresh offers.
17. Проверь, что alignment и project state согласованы. Update-транзакция считается завершённой только после этой проверки либо честного status `needs user choice` / `blocked`.

## Output

Пиши человекочитаемый артефакт и сообщение по-русски и кратко. Сохраняй технические идентификаторы; удаляй пустые разделы и повторы.

Создай или обнови `docs/prompt-kit-workflow-alignment.md`:

```md
# Сопоставление проекта с Prompt Kit

## Результат

- Статус: сопоставлено / нужен выбор / заблокировано
- Версия: [до] → [после]
- Tag, ID репозитория и дата проверки:
- Целостность: пройдена / ошибка; `docs/prompt-kit-integrity.md`

## Положение проекта

- Текущий этап:
- Уверенность:
- Подтверждение:
- Этап сохранён: да / нет, причина
- Следующий промпт до и после сопоставления:

## Изменившиеся области workflow

| Область | Что изменилось | Что уже есть в проекте | Статус | Действие | Нужно подтверждение |
| --- | --- | --- | --- | --- | --- |

## Необязательные улучшения

| Предложение | Польза | Стоимость или риск | Команда пользователя |
| --- | --- | --- | --- |

## Не запускать автоматически

- [этапы и причины]

## Состояние проекта

- Версия записана: да / нет
- Текущий этап и следующий промпт:
- Метаданные Git и credentials: не изменены и не скопированы
```

Удаляй пустые таблицы. Пользователю сообщи, сохранилась ли реальная стадия проекта и нужен ли выбор; optional refresh не выдавай за обязательную работу.

## Done when

- Installed manifest, update summary и integrity report согласованы.
- Есть `docs/prompt-kit-workflow-alignment.md` для target release.
- Реальная project stage не откатилась без evidence.
- Changed workflow areas диапазона from -> to рассмотрены.
- Creator-Critic Design Loop не вызвал автоматический rollback/redesign; targeted optional refresh, если полезен, описан отдельно.
- Covered, migration, optional, rerun и blocked statuses применены честно.
- Optional refresh сформулированы понятно и не запущены автоматически.
- Migration artifacts, если созданы, имеют явный source evidence.
- `docs/project-state.md` обновлён до installed version и согласован с alignment.
- Git пользователя не изменён.
- GitHub credentials не скопированы в project reports; MIT License по compatibility path `.prompt-kit/TERMS.md` остаётся частью установленного kit.
- Пользователь понимает, нужно ли от него действие.

## Follow-up

Если alignment нашёл только `covered` или optional refresh, продолжай с реальным recommended prompt из `docs/project-state.md`. Optional refresh запускай только после явного выбора пользователя.

Если найден recommended rerun, объясни пользу и риск, затем дождись подтверждения. Если найден blocker, задай один короткий вопрос.

Если prerequisites не выполнены, вернись в `prompts/_maintenance/01-update-prompt-kit.md` или `prompts/_maintenance/02-check-kit-integrity.md`; не объявляй update завершённым.
