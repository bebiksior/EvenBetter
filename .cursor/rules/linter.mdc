---
globs:
alwaysApply: true
description: Linter Guidelines
---

# Linter

We have a built-in ESLint linter configured at the root folder. After making any significant change, always run the linter with `pnpm lint` and fix all potential issues.

## Most common mistakes that lead to linter errors

### Lint Rule: Unexpected nullable string value in conditional. Please handle nullish or empty cases explicitly

To prevent this, when comparing strings, instead of writing:

```
if (!str) {}
```

do this:

```
if (str !== undefined) {}
```
