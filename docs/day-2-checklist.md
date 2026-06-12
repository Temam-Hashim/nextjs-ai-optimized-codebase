# Day 2 Deliverables Checklist

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Working crop dashboard UI | ✅ Done — `/dashboard/crops` |
| 2 | Feature flag usage | ✅ Done — bulk import + buyer inventory |
| 3 | 5-minute challenge feature | ✅ Done — harvest alerts + summary cards |
| 4 | `docs/architecture-decisions.md` | ✅ Done |
| 5 | Code + security review | ✅ Done — owner checks, public aggregate only |
| 6 | Scope-change simulation | ✅ Done — `docs/requirements-v2.md` + `/inventory` |
| 7 | Portfolio README | ✅ Done |
| 8 | Clean git commits | ⏳ **You** — commit and push to GitHub |
| 9 | Feature-flag exercise (optional) | ⏳ **You** — optional evening task |

## Demo paths

1. **Farm manager:** Login → Dashboard (alerts + summary) → Crops → add/edit/filter/delete
2. **Buyer:** Home → Market inventory (`/inventory`) — read only
3. **Feature flags:** Toggle `NEXT_PUBLIC_FEATURE_*` in `.env`, restart dev server

## Validation

```bash
bun run lint && npx tsc --noEmit && bun test
```
