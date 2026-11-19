---
name: project-architecture
description: My project architecture: standalone services, layered folders, modules, types in separate files, docs layout, DB rules. Use when creating a project, service, module or folder, deciding where code goes, or writing plans and API docs.
argument-hint: [feature or folder to place]
---

# Architecture

`/project-architecture <thing>`: say where it goes (service, layer, file names, docs needed). No argument: compare the repo with these rules and list differences. Never move files without asking. The project's `CLAUDE.md` wins where it differs.

## Repo

- One repo holds one or more **standalone services**: own `package.json` (or manifest), `.env`, `tsconfig.json`, run from its own folder. No workspaces, no `packages/`. Exception: an API + web app sharing types uses `server/`, `web/`, `shared/`.
- Services talk over HTTP or a database schema they own, never by importing each other.
- Every top-level folder has a `README.md`. `.env` is git-ignored, `.env.example` tracked. One dev port per service, in `.claude/launch.json` and CLAUDE.md.

```
repo/
├── CLAUDE.md, README.md
├── docs/  api/ (<service>.md + .openapi.yaml, updated with the route)
│          plans/ (one topic per file, first line `Status: draft | approved | superseded`, README index)
│          research/   verify/ (see project-verify)
├── scripts/           helpers and <thing>-check scripts
└── <service>/
```

Plans are approved before code.

## Inside a service

```
src/  types/ (*.types.ts, no logic)     domain/ (pure rules, ports)
      application/ (use cases)          infrastructure/ (adapters: persistence/, http/, <provider>/)
      api/ (routes, mapping)            config/    db/    main.ts (composition root)
tests/  see project-tests
```

- `api` → `application` → `domain` ← `infrastructure`. Domain imports nothing outside.
- Wire adapters by hand in one place, no DI container. Create only the folders needed.
- Big service: `src/modules/<feature>/{types,domain,application,infrastructure}` with an `index.ts` as the only import point, plus `shared/` and `app/` (wiring).
- Variants (job boards, search providers) are **plugins**: a folder per variant implementing one interface.

## Data

PostgreSQL, one schema per service, ORM entities without decorators, `synchronize` off, **generated migrations**. Small single-user tools may keep git-ignored JSON under `data/`.

## Habits

- CLAUDE.md names generated folders never to edit, and their source.
- Big projects get one dev CLI (`doctor`, `start`/`stop`, `build`, `test --affected`, `check --changed`), also exposed as MCP tools in `.mcp.json` for agents.
- A `doctor` script reports what is missing on the machine.
- Repeated workflows become `.claude/commands/<name>.md` with limited `allowed-tools`, and "read-only, do not commit" when true.
- Cross-project rules go in the workspace root CLAUDE.md.
- Paid APIs, real accounts and production keys are opt-in by env flag.
- Choices go in `docs/decisions.md`, open work in `TODO.md`. Docs state status and dates plainly.
- Typecheck without building (`tsc --noEmit`); run only the affected check.
