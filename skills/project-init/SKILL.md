---
name: project-init
description: Set up a project my way. Interviews (what it is, mono or single repo, stack, comments, style, tests, verify), then writes CLAUDE.md, docs/code-style.md, lint and format configs, docs skeleton and a verify script.
disable-model-invocation: true
argument-hint: [defaults]
---

# project-init

Interview with `AskUserQuestion` (max 4 questions per call, recommended option first, marked `(Recommended)`), then write files. `defaults` skips the interview and takes every recommended answer. If `AskUserQuestion` is unavailable (headless or other agents), never skip the interview: send each batch as one numbered chat list (options lettered, recommended marked), end your turn, and continue when the reply arrives. Silent guessing is allowed only for `defaults`.

## 0. Look first

Read `CLAUDE.md`, `README.md`, `package.json` or other manifests, `.editorconfig`, `.claude/`, and the top two folder levels. Say in one line what you found.
- Existing `CLAUDE.md`: merge, never overwrite; show what changes.
- Existing code: infer stack and style, offer them as the recommended answers.

## 1. Interview

**Batch 0: what it is** (one plain chat message, free text, wait for the reply; skip what step 0 answered)
What it does and for whom; main parts or features; external services and the `.env` key names they need; status (idea, planning, early build, built); anything it must never do or touch. Read a two-line summary back for correction. No answer: leave `TODO: what it is` in CLAUDE.md, never invent a purpose.

**Batch A: architecture**
1. Repo type: single project / monorepo of standalone services (own `package.json`, `.env`, run from own folder) / monorepo with workspaces (`server/`, `web/`, `shared/`) / scripts only. Recommend what exists; else single project.
2. Monorepo only: service names, one-line roles, dev ports (free text).
3. Inside an existing monorepo (parent `CLAUDE.md` lists services): is this a new service of it? If yes, set up only the service and add it to the parent `CLAUDE.md` and `.code-workspace`.

**Batch B: stack** (ask per service when the repo has several)
1. Primary language: TypeScript (Recommended) / Python / C# / Rust (Other: Go, Java, Lua, PHP, C++)
2. Extra languages in the same project (multi-select): none (Recommended) / Python / Rust / Lua
3. Data: PostgreSQL with migrations / SQLite / JSON files in `data/` / none

Then, in a second call, using the language's rows in `project-style/languages.md`:
4. Framework or runtime: its "Common stacks" list (TypeScript: recommend Bun).
5. Code layout: layered, types in separate files (Recommended) / layered, types inline / flat
6. Modules: plain layers (Recommended) / `modules/<feature>/` for a big service

**Batch C: comments**
1. Need comments? Only the why (Recommended) / why + docs on exported API / almost none / thorough
2. Length: one to three lines (Recommended) / one line / short paragraph
3. Where (multi-select): above functions / above type fields / inline on non-obvious lines / file header
4. Max line width: 120 (Recommended) / 100 / 140 / none

**Batch D: style** (only what the language has)
1. Braces: Allman, `{` on its own line, enforced by lint (Recommended) / K&R
2. Indent: 4 spaces (Recommended) / 2 spaces / tabs
3. Semicolons and quotes: `;` + single (Recommended) / `;` + double / none + single / none + double
4. Enforcement: lint and format config files (Recommended) / prose rules only

**Batch E: verify, docs, tests, rules**
1. Verify evidence in `docs/verify/`: yes (Recommended) / no
2. Date folder: `DD-MM-YY` (Recommended) / `YYYY-MM-DD` / `DD-MM-YYYY`
3. Browser verify: Puppeteer (puppeteer-core + installed Chrome) / Playwright / none. Recommend Puppeteer only when the project has a web UI, otherwise none (APIs use `<thing>-check` scripts).
4. Docs folders (multi-select): plans / api / research / scripts

then:
5. Test layout: `tests/` with `unit/ integration/ setup/ fixtures/` (Recommended) / flat `tests/` / `scripts/*-check` only
6. Test runner: the language's row in `languages.md`; recommend what `package.json` already has
7. Branches: work on `dev`, never push `main` unless asked / work on `main` / no rule
8. Test runs: only the affected check (Recommended) / full suite is fine
9. Claude attribution in commits and PRs (Co-Authored-By, "generated with" lines): none (Recommended) / keep

Text typed under "Other" is a rule: add it to CLAUDE.md Rules.

## 2. Write files

Use `templates/`. Drop placeholders and conditional blocks that do not apply. CLAUDE.md stays under about 80 lines.

| File | Content |
|---|---|
| `CLAUDE.md` | `templates/CLAUDE.md` filled from Batch 0 and the answers |
| `docs/code-style.md` | `templates/code-style.md` with a real snippet in the chosen language |
| lint and format configs | snippets for each language from `project-style/languages.md`; add the `lint:fix` or format script; `.editorconfig` always |
| `README.md` | only if missing |
| `<service>/` (monorepo) | `README.md`, manifest, `.env.example`, empty layer folders; own `CLAUDE.md` only if its rules differ. No root workspaces file for standalone services |
| `<name>.code-workspace` (monorepo) | one root per service plus `docs` |
| `docs/README.md`, `docs/plans/README.md` (Plan / Status / About), `docs/api/`, `docs/research/` | as chosen, folders with `.gitkeep` |
| `tests/` | chosen folders and a 3-line `tests/README.md` (what goes where, run command, `project-tests` rule) |
| `docs/verify/README.md` | folder format, rules, how to run |
| `scripts/verify/verify.mjs`, `.env.local.example` | `project-verify/templates/verify.mjs` with `{{DATE_FORMAT}}` replaced (Puppeteer); Playwright uses `@playwright/test` and `VERIFY_TASK`, same folders |
| `.gitignore` | `.env`, `.env.local`, `node_modules`, `docs/verify/_scratch`, language build output |
| `.claude/launch.json` | one entry per service with dev command and port |
| `.claude/settings.json` | when attribution = none: `{"attribution":{"commit":"","pr":""}}` |

Scaffold only what the project needs now. Do not install packages without saying so.

## 3. Finish

1. `package.json` must list the framework, lint and test dependencies, so one install makes `lint:fix` work (TypeScript: `eslint`, `typescript`, `typescript-eslint`, `@stylistic/eslint-plugin`, plus `puppeteer-core` if Puppeteer, with the `verify` script). Do not run the install unless the user agrees.
2. Run the new lint once on the scaffold and fix what it flags. Do not commit.
3. Reply: files written, answers as a compact table, first command to try. Say `/project-init` can be re-run later and merges.
