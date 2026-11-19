# Code style

Chosen on <DATE> with `/project-init`. Overrides the defaults in `project-style`.

| Rule | Choice |
|---|---|
| Language(s) | <list> |
| Indent | <4 spaces / 2 spaces / tabs> |
| Braces | <Allman: every block opens `{` on its own line, always braces / K&R> |
| Semicolons, quotes | <yes/no, single/double> |
| Max line width | <120 / 100 / 140 / none> |
| Types | <separate `types/` files / inline> |
| File names | lowercase kebab-case, kind before the extension (`user.service.ts`) |
| Enforced by | <config files and the `lint:fix` command, or "prose only"> |
| Exceptions | <language rules that override the table, e.g. Go gofmt, Python has no braces> |

## Comments

| Question | Choice |
|---|---|
| Policy | <only the why / why + docs on exported API / almost none / thorough> |
| Length | <one line / one to three lines / short paragraph> |
| Where | <only the places chosen> |

- <one bullet per choice, as an instruction>
- Never narrate what the code says. Fix or delete a comment when its code changes. No commented-out code.

## Example

```<lang>
<10-20 lines in exactly this style and comment policy>
```
