---
name: project-tests
description: My test conventions: tests in their own folder (never beside source), unit / integration / e2e levels, fixtures and setup helpers, run only the affected ones. Use when writing, placing, naming or running tests.
argument-hint: [thing to test]
---

# Tests

`/project-tests <thing>`: write its tests in the right place, run only those, report. The project's `CLAUDE.md` wins where it differs. Runner per language: `project-style/languages.md`.

## Where

Tests are **never colocated** with source. A separate folder per service, mirroring the code when there are many files, flat when few.

```
tests/  unit/  integration/  setup/ (test data source, module factory, stubs)  fixtures/ (small, committed)
scripts/<thing>-check.*     self-checking scripts
scripts/run-selftest.*      e2e: temp copy of data, drives the app, writes evidence
```

Browser tests (Playwright) are their own package `browser/` or `e2e/` with `tests/<service>/*.spec.ts` and `lib/`.

## Names

- Files: `<unit>.spec.ts` or `.test.ts` (one per project), `test_<unit>.py`; add the kind when needed (`order.integration.spec.ts`).
- Test names are sentences about behaviour ("does not let a look-alike path through"). Many inputs to one rule: table-driven (`it.each`, `parametrize`).
- A bug-reproducing test starts with a comment: what broke, why the fix works.

## Levels

1. **Unit or check**: no browser, network or real clock; fast, run first. Often a script printing `PASS name` / `FAIL name` and exiting non-zero.
2. **Integration**: real SQL (in-memory or throwaway schema), real wiring, one data source per file closed in `afterAll`. Race and transaction bugs live here.
3. **E2E self-test**: app on a **temporary copy of the data**, fixtures instead of live sites, real UI headless, API probes, report and screenshots in `docs/verify/`. Never real data, accounts or production keys.

## Rules

- **Run only what you changed**: one file, one name filter, related-tests, `--only`, `--affected`. Whole suite only when asked.
- Anything paid or touching a real account is **opt-in by env flag**, off by default, stated in the test header.
- Isolate: temp dirs, own port, throwaway database. Stub third-party widgets (captcha), never the code under test.
- Specs sharing a database or test account run with one worker; say why in the config.
- Fixtures are small, realistic, committed; no secrets or personal data.
- Wait on conditions, not fixed sleeps; comment any unavoidable sleep.
- A test fails for one reason and says which (`expect(x, 'HTTP status of /')`).
- Never weaken or delete a failing test to get green: fix the code, or say why the test is wrong.

Report: command run, pass/fail counts, what was not run. UI work also gets evidence per `project-verify`.
