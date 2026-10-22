# GitHub — Гостевой дом 44

Repository: https://github.com/shelpakovzhenya-art/GoSTI44

Workspace/context branch: `orca/workspace/gosti44`. Source recovery branch: `orca/source/gosti44`. Current source folder: `C:\Users\della\OneDrive\Документы\New project\GoSTI44-production-20261020`.

`CURRENT_CONTEXT.md` is a synchronized copy of `C:/Users/della/OneDrive/Документы/New project/GoSTI44-production-20261020/PROJECT_CONTEXT.md`; the canonical handoff stays at that path. Existing source history and default production branch are preserved.

After every task, commit and push reviewed source changes on the task branch, update TASKS.md and the canonical context, then run:

```powershell
node C:/Users/della/orca/workspace-setup/github-sync/github-sync.mjs sync gosti44 --message "Describe task result"
node C:/Users/della/orca/workspace-setup/github-sync/github-sync.mjs snapshot gosti44 --message "Save verified source state"
```

The snapshot command reads local files without changing source HEAD, index, or working files. It excludes secrets, database exports, backups, dependencies and chat data, and pushes only a recovery branch. It does not deploy the site. Large files require separate handling and are reported as blockers.
