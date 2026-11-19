---
name: project-verify
description: Verification pattern: after building or changing something, check it for real and save proof (screenshots, logs, NOTES.md) in docs/verify/<date>/<theme>/, with a Puppeteer step runner. Use after finishing UI, forms, scraper, email or API work, or when asked to verify.
argument-hint: [theme or what to verify]
---

# Verify

"Done" means checked with proof saved, every time, not only on request. `/project-verify <theme>`: check the named thing (or the latest change), run the matching check or `verify.mjs`, save evidence, report.

## Evidence folder

`docs/verify/<DATE>/<THEME>/`: the only place for evidence (services keep none).
- `DATE` in the project's format from CLAUDE.md (default `DD-MM-YY`: 10 Nov 2026 is `10-11-26`). `THEME` is short kebab-case (`signup-flow`). Another day's check gets a new dated folder.
- `NOTES.md` (what, how, pass/fail, what is not done; `templates/NOTES.md`), `*.png` screenshots (clip or half size), `*.log` with only the lines that prove the point, `meta.json` and `report.md` from `verify.mjs`.
- No secrets in dumps or screenshots; credentials from an untracked `.env.local`; scratch runs use `--date _scratch` and are deleted.

## Two kinds of check

1. **Pure checks** (`scripts/<thing>-check.*`): `check(name, pass, detail)` prints `PASS`/`FAIL`, exits non-zero on failure. Run only the one for your change.
2. **Browser verify** (`scripts/verify/verify.mjs`): Puppeteer drives the real UI and writes the evidence folder.

## Browser verify script

Copy `templates/verify.mjs` to `scripts/verify/verify.mjs`. Needs only `puppeteer-core` and an installed Chrome (`CHROME_PATH` or default location).

```
node scripts/verify/verify.mjs --theme login-form --url http://localhost:5173 [--only 02,03] [--date _scratch]
```

- One numbered, independent `step('NN', 'title', async ({ rec, shot, open }) => {...})` per scenario. A failing step records `FAIL-NN.png` and the run continues.
- Assertions are named booleans: `rec.checks.someThing = <bool>`; any `false` fails the step.
- UI work covers desktop and mobile (390x844) and records console errors and failed requests.
- Ends with a summary line, exit code 1 on any failure.

## After a run

1. Open the screenshots. A passing check on a blank page is a failure.
2. Write `NOTES.md`; say plainly what failed or was not checked.
3. Report the folder path and result in two lines.
