---
description: Run linter, type checker, and tests for Safrico (Next.js AI codebase)
---

# Validate

Run all validation checks and report results.

---

## Checks to Run

```bash
bun run lint && npx tsc --noEmit && bun test
```

If `bun` is unavailable, use:

```bash
npm run lint && npx tsc --noEmit && npm test
```

---

## Process

1. Run lint, capture output
2. Run type check, capture output
3. Run tests, capture output
4. Collect all failures
5. Report results

---

## Output

Report in this format:

```
## Validation Results

| Check | Result | Details |
|-------|--------|---------|
| Lint | ✅/❌ | {N errors or "passed"} |
| Type check | ✅/❌ | {N errors or "passed"} |
| Tests | ✅/❌ | {N passed, M failed} |

### Summary
- **Status**: ✅ ALL PASSING / ❌ {N} FAILURES
- **Action needed**: {None / list of things to fix}
```

---

## If Failures Found

List each failure with:
1. File and line number
2. Error message
3. Suggested fix (if obvious)

Fix issues and re-run until all checks pass.
