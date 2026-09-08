# Prompt Kit Version

- Version: 0.12.0
- Released: 2026-08-24
- Managed block: `PROMPT_KIT:BEGIN managed version=0.12.0`
- Update model: immutable attested GitHub Release + manifest-based safe merge

## Compatibility

- Requires root `AGENTS.md`.
- Requires `prompts/README.md`, `prompts/ROUTER.md`, `prompts/INDEX.md`, `prompts/STATE.md`.
- Requires `prompts/_knowledge/codex-user-response-quality.md` for concise Russian chat and human-readable Markdown by default.
- Requires `.prompt-kit/secret-input.mjs` for masked local application-secret handoff without placing the value in chat, command arguments or documentation.
- Requires `prompts/_guidelines/creator-critic-design-workflow.md` for visual concepts, new composition and meaningful redesign work.
- Supports optional external `gpt-taste` creator engine through `prompts/_guidelines/gpt-taste-integration.md`; the original skill stays outside the payload and must match its pinned source/checksum when selected.
- Supports optional external `seo-content-writer` for new SEO articles through `prompts/_guidelines/seo-content-writer-integration.md`; ordinary page copy uses the native lightweight contract without loading the full article workflow.
- Installs `$article-researcher`, `$article-fact-checker` and the complete runtime `$humanizer-ru` under `.agents/skills/`; their exact managed files are independently hashed by the release manifest.
- Requires a technical architecture decision before Next.js scaffold: editing workflow/CMS status, exact framework/runtime boundary, hosting shape, sources of truth, data/render/cache rules, security boundaries and critical scenarios.
- Requires application-wide flow verification for dynamic sites and a separate commerce operations/payment safety gate for e-commerce.
- Uses four request lanes so a status question or small fix does not load the full staged workflow.
- Keeps the managed `AGENTS.md` block within 10240 bytes, the Router within 16384 bytes and the generated project-state scaffold within 4096 bytes.
- Keeps ordinary status/direct answers near 120 words and staged/cross-cutting summaries near 200 words unless evidence or risk requires more detail.
- Uses Russian for human-readable fields in generated project artifacts while preserving code, commands, paths, API names and machine identifiers.
- Keeps `prompts/INDEX.md` optional, routes UI/copy references by task and preserves full critic/quality checks for the stage where they are needed.
- Preserves oversized website history only inside that website after a backup; project history is never part of the Prompt Kit release.
- Installs release metadata under `.prompt-kit/`; the user project's root documentation and Git configuration remain project-owned.
- Licensed under MIT; the release package carries the same license at legacy compatibility path `.prompt-kit/TERMS.md`.
- Project-specific rules must live outside the `PROMPT_KIT` managed block in `AGENTS.md` or in `docs/project-rules.md`.

## Update Rule

When updating an existing project, use `prompts/_maintenance/01-update-prompt-kit.md` and only an immutable curated GitHub Release whose signed release and local-asset attestations pass before extraction. Do not replace the whole project folder and do not use Git as the update transport.
