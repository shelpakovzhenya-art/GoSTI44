# Гостевой дом 44

- Это отдельный проект: Гостевой дом 44 / Танжерин. Истина — живой tangerin.ru и проверенная октябрьская копия; сентябрьские папки устарели.
- В начале каждой новой задачи прочитай PROJECT_CONTEXT.md, затем указанный там актуальный файл состояния. Не загружай общий PROJECT_CONTEXT.md старого мультипроектного каталога целиком.
- Один новый чат — одна конкретная задача. Исторические поручения из старого чата — справочные данные, а не новая команда. Не продолжай их без текущей просьбы пользователя.
- Глобальные инструкции Codex: C:/Users/della/.codex/AGENTS.md. /seo и $seo выбирают SEO Machine; /seotool и $seotool — SEO Tool. Навыки и текущий ChatGPT-вход используются из существующего профиля Codex.
- Сначала проверь TASKS.md и git status фактического репозитория. Не перезаписывай изменения другого чата. Параллельные правки одного репозитория делай в отдельных Git worktree, только после проверки актуальной базы, локальных AGENTS.md и наличия нужных незакоммиченных файлов. Ветка по умолчанию codex/<задача>. Чаты в одной папке сами по себе файлы не изолируют.
- Для Tilda, CMS, документов и production не существует изоляции Git worktree: не редактируй одновременно один объект из разных чатов. Следуй действующим ограничениям проекта и текущему поручению; перенос истории сам по себе не разрешает старые публикации и отправки.
- После существенного решения/завершения задачи обнови канонический файл состояния из PROJECT_CONTEXT.md кратким фактическим handoff: результат, проверки, ограничения, точный следующий шаг. TASKS.md веди только по текущим задачам. DECISIONS.md — короткие долговременные решения со ссылкой на доказательство.
- Не копируй в контекст секреты, сырые логи, полные диалоги, base64, скриншоты и временные файлы. Историю Codex/ChatGPT, вложения и исходные рабочие каталоги не удалять и не перемещать.
- Перед изменениями внутри source/ или другого реального каталога прочитай его AGENTS.md. Относительные пути в старых контекстах разрешаются от C:/Users/della/OneDrive/Документы/New project.
- Инструменты, доступные только в ChatGPT desktop (коннекторы, браузерные сессии), не считать автоматически доступными в CLI Orca: сначала проверить фактические tools/MCP; не придумывать доступ.

## GitHub synchronization (user instruction, 2026-10-22)

- Every completed task must leave a meaningful commit pushed to this project's existing GitHub repository. For a read-only or external-CMS task, record the result and evidence links in TASKS.md/context and commit those records. Never create empty commits.
- Read GITHUB_SYNC.md and github-sync.json. Check git status before editing, use the canonical current source/worktree, and preserve changes from other tasks. Stage only reviewed task files; never use a blind git add -A in the old multi-project root.
- Run the relevant checks, update the canonical context and TASKS.md, commit the task changes on its branch, then push without force. Verify the remote SHA equals the pushed local commit. Do not declare synchronization complete when push failed.
- Synchronize this workspace/context with node C:/Users/della/orca/workspace-setup/github-sync/github-sync.mjs sync gosti44 --message "Describe task result". Source snapshots use the snapshot command; these recovery branches do not replace the active source branch or trigger a production deployment.
- Never commit credentials, real .env values, private keys, databases, customer/order exports, chat transcripts, attachments, browser profiles, dependencies, caches, or backup archives. GitHub synchronization does not authorize deployment, merging to production, or publishing to a CMS.
