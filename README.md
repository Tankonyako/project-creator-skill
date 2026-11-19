# project-creator-skill

Five agent skills that set up and keep a project the way I build them: structure, code style, comments and verification with saved evidence. Patterns come from my own projects (a multi-service Bun + TypeScript repo, a Playwright-checked web suite, a game-server workspace, a job-search app).

Each skill is also a slash command:

| Command | Does |
|---|---|
| `/project-init [defaults]` | Interview (what it is, mono or single repo, stack, comments, style, tests, verify), then writes `CLAUDE.md`, `docs/code-style.md`, `.editorconfig`, the docs skeleton and a Puppeteer verify script |
| `/project-architecture [thing]` | Says where a feature goes, or checks the repo layout against my rules |
| `/project-style [path]` | Reviews and fixes code format and comments against my style |
| `/project-tests [thing]` | Writes and runs tests in a separate `tests/` folder (unit, integration, e2e), only the affected ones |
| `/project-verify [theme]` | Runs the check, saves evidence to `docs/verify/<date>/<theme>/` with `NOTES.md` |

`project-init` runs only when you type it. The others also load by themselves when the task matches.

## Install

With the [skills CLI](https://github.com/vercel-labs/skills) (works for Claude Code and other agents; needs Node):

```bash
npx skills add Tankonyako/project-creator-skill            # pick skills and agents interactively
npx skills add Tankonyako/project-creator-skill --list     # list what is inside first
npx skills add Tankonyako/project-creator-skill -g -y      # all skills, global, no prompts
```

This keeps the command names as written above (`/project-init`).

As a Claude Code plugin instead (commands become `/project-kit:project-init`):

```
/plugin marketplace add Tankonyako/project-creator-skill
/plugin install project-kit@project-creator-skill
```

By hand: copy the folders in `skills/` into `~/.claude/skills/` (or `<project>/.claude/skills/` for one project).

Then in any project: `/project-init`.

## Layout

```
.claude-plugin/        plugin.json, marketplace.json (plugin install only)
skills/
├── project-init/          SKILL.md + templates/{CLAUDE.md, code-style.md}
├── project-architecture/  SKILL.md
├── project-style/         SKILL.md + languages.md (per-language adapters)
├── project-tests/         SKILL.md
└── project-verify/        SKILL.md + templates/{verify.mjs, NOTES.md}
```

The generated verify script needs only `puppeteer-core` and an installed Chrome.

## License

MIT
