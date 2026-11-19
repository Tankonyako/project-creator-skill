# <project name>

<One or two sentences from Batch 0: what it is and who uses it.>

<!-- One bullet per service or main part: **name/** what it does, status, port. Delete for a tiny project. -->

Status: <idea | planning | early build | built>. <External services, with `.env` key names.>

## Stack

<Languages, runtime, framework, database. Secrets: `.env` git-ignored, `.env.example` tracked.>

## Layout

```
<tree, two levels deep, one comment per line>
```

Folder rules: `project-architecture` skill. Every top-level folder has a `README.md`.

## Commands

```
<install / dev / start / typecheck / lint:fix / test / verify>
```

<Dev ports.>

## Code style

Full rules in `docs/code-style.md`. In short: <indent, braces, semicolons, quotes, width>. Comments: <policy in one line>. Enforced by `<lint command>`.

## Conventions

- **Verification** <!-- omit if no -->: save proof of every check to `docs/verify/<DATE_FORMAT>/<theme>/` (screenshots, logs, `NOTES.md`). Browser checks: `<command>`. See `project-verify`.
- **Plans** <!-- omit if no -->: `docs/plans/`, one topic per file, first line `Status: draft | approved | superseded`, indexed in its README, approved before code.
- **API docs** <!-- omit if no -->: `docs/api/<service>.md` and `.openapi.yaml`, updated with the route.
- **Research** <!-- omit if no -->: `docs/research/`, one topic per file.

## Rules

- Tests live in `tests/` (<layout>), run with `<command>`; see `project-tests`. Paid or real-account actions are opt-in by env flag.
- Never edit generated files: <list or delete this line>.
- Never commit `.env` or real secrets.
- <If attribution = none: no Co-Authored-By, "Generated with" or other AI attribution in commits or PRs.>
- <Branch rule.>
- <Test-run rule.>
- Host: <OS, shell>.
