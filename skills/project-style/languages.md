# Language adapters

Read only the row and snippet for the languages the project uses. Values in `{braces}` come from the init answers. Prefer a linter or formatter that fails on a wrong brace over prose rules.

| Language | Common stacks | Test runner | Allman enforced by |
|---|---|---|---|
| TypeScript / JS | Bun + Hono, Node + Express, NestJS, Next.js, Vite + React | bun test, Jest, Vitest | ESLint + `@stylistic` (Prettier cannot do Allman, do not add it) |
| Python | FastAPI, Django, Flask, script/CLI | pytest | n/a: no braces; `ruff format` |
| C# | ASP.NET Core, worker service, console | xUnit, `dotnet test --filter` | `.editorconfig` + `dotnet format` |
| Rust | Axum, clap CLI, library | `cargo test` | `rustfmt.toml` (brace options need nightly rustfmt) |
| Go | net/http + chi, CLI | `go test` | n/a: `gofmt` forces same-line braces; follow it |
| Lua | game addon, LÖVE, scripts | GLuaTest, busted | n/a: `end` blocks; StyLua |
| Java | Spring Boot, plain | JUnit | Checkstyle `LeftCurly: nl` |
| C / C++ | CMake app, library | CTest, GoogleTest | `.clang-format` |
| PHP | Laravel, plain | PHPUnit | PHP-CS-Fixer `curly_braces_position` |
| Other | ask | ask | closest formatter option. If the formatter forbids Allman, follow the formatter and record the exception in `docs/code-style.md` |

## Snippets

**TypeScript / JS**: `eslint.config.js` rules (add `@stylistic/eslint-plugin`, `typescript-eslint`); script `"lint:fix": "eslint --fix"`.
```js
rules: {
    'curly': ['error', 'all'],
    '@stylistic/brace-style': ['error', 'allman', { allowSingleLine: false }],
    '@stylistic/indent': ['error', {indent}],        // 4, 2 or 'tab'
    '@stylistic/semi': ['error', '{always|never}'],
    '@stylistic/quotes': ['error', '{single|double}', { avoidEscape: true }],
    '@stylistic/max-len': ['warn', { code: {width}, ignoreStrings: true, ignoreUrls: true }],
}
```

**C#**: `.editorconfig`
```
[*.cs]
csharp_new_line_before_open_brace = all
csharp_new_line_before_else = true
csharp_new_line_before_catch = true
csharp_new_line_before_finally = true
```

**Rust**: `rustfmt.toml`, run `cargo +nightly fmt`
```
unstable_features = true
brace_style = "AlwaysNextLine"
control_brace_style = "AlwaysNextLine"
max_width = {width}
hard_tabs = {true|false}
```

**C / C++**: `.clang-format`
```
BasedOnStyle: LLVM
BreakBeforeBraces: Allman
IndentWidth: {indent}
ColumnLimit: {width}
```

**Python**: `pyproject.toml`
```
[tool.ruff]
line-length = {width}
indent-width = 4
[tool.ruff.format]
quote-style = "{single|double}"
```

**Lua**: `stylua.toml`
```
column_width = {width}
indent_type = "{Tabs|Spaces}"
indent_width = {indent}
collapse_simple_statement = "Never"
```

**Java**: Checkstyle `<module name="LeftCurly"><property name="option" value="nl"/></module>` and `RightCurly` with `alone`.

**Go**: nothing to configure. Use `gofmt`, tabs.

Every language also gets `.editorconfig` (indent, LF, UTF-8, final newline, trim whitespace except `*.md`).
