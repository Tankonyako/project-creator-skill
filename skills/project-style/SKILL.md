---
name: project-style
description: My strict code style (Allman braces, comments only for the why) adapted per language. Use when writing or editing code or when asked about formatting or comments. The project's docs/code-style.md overrides these defaults.
argument-hint: [file or folder to check]
---

# Code style

`/project-style <path>`: review that path (default: working-tree changes) and fix deviations. Format and comments only, never behaviour.

Order of authority: `docs/code-style.md` of the project, then the surrounding file, then these defaults. Per-language tooling: `languages.md`.

## Braces: strict

- Every block opens with `{` on **its own line**: functions, methods, classes, interfaces, enums, `if`, `else if`, `else`, loops, `switch`, `try`, `catch`, `finally`, callbacks, lambdas and arrow bodies.
- `else`, `catch`, `finally` start on a new line after the `}` line.
- Always braces, even for one statement. No single-line blocks, no `if (x) return;`.
- Object, array and table literals are data, not blocks: `{` stays on the line of the assignment or argument; multi-line ones have one entry per line.
- Where the language has no braces (Python, Lua) or its formatter forbids this (Go), follow the language and say so in `docs/code-style.md`.
- Enforce with the linter config from `languages.md`, not by eye.

## Other defaults

- TypeScript: semicolons, 4 spaces, single quotes, about 120 columns, types in `types/` files, `import type`.
- Lowercase kebab-case file names with the kind before the extension: `action.rules.ts`, `user-config.types.ts`.
- Early returns, small named functions, no dead or commented-out code.
- Errors a caller can act on are values (`{ ok: false, errorCode, hint }`), not thrown strings.
- Magic numbers become constants with the unit in the name (`TIMEOUT_MS`).

```ts
// Points of a cell split the way quarters() splits it: NW, NE, SW, SE.
function splitPoints(bbox: Bbox, points: PoiPoint[]): PoiPoint[][]
{
    const out: PoiPoint[][] = [[], [], [], []];
    for (const point of points)
    {
        out[quarterOf(bbox, point)]!.push(point);
    }
    return out;
}
```

## Comments

Default: **only the why**: a constraint, workaround, unit, surprising order, outside rule.

- One to three lines above the thing. No banners, no author or date stamps.
- Type fields get one line when meaning or unit is not obvious.
- Never narrate the next line or repeat the name. Fix or delete a comment when its code changes.
- Section markers in long files: `// ---- keys ----`.

The comment density, length and placement chosen at init are in `docs/code-style.md` and win.
