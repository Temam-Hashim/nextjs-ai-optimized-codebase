# AI-Augmented Team Workflow — Safrico (3-Person Team)

**Primary AI editor: Cursor** (Agent, rules, Composer). No Claude Code CLI required.

## Team Roles

| Role | Person | Primary Tool | Responsibility |
|------|--------|--------------|----------------|
| **Tech Lead** | You | Cursor Agent + rules | Architecture, PRDs, code review, AI layer |
| **Full-Stack Dev** | Dev 2 | Cursor Agent | Feature implementation, UI |
| **QA / DevOps** | Dev 3 | Cursor + GitHub | Tests, CI, feature flags, security review |

## SDLC Flow: PRD → PIV (Cursor)

```
PRD (docs/PRD.md)
  ↓
Plan — Cursor chat: "Plan from docs/requirements.md" (no code)
  ↓
Implement — Cursor Agent with @requirements.md attached
  ↓
Validate — bun run lint && npx tsc --noEmit && bun test
  ↓
Review — Cursor: "Review for security and maintainability"
  ↓
PR → merge behind feature flag → production
```

### 1. Plan (Human + Cursor)

- Tech Lead writes `docs/requirements.md`
- Cursor: attach PRD + requirements → ask for implementation plan only
- Dev reviews plan before Agent runs

### 2. Implement (Cursor Agent)

- Attach `@docs/requirements.md` and `@.cursor/rules/safrico.mdc`
- Agent follows `src/features/projects/` as template
- Multi-file edits in one session

### 3. Validate (Terminal + Human)

```bash
bun run lint && npx tsc --noEmit && bun test
```

- QA reviews auth and public API changes
- Tech Lead approves schema migrations

## Human vs AI Intervention

| Task | AI (Cursor) | Human |
|------|-------------|-------|
| Scaffold feature slice | ✅ | Review structure |
| CRUD + Zod + tests | ✅ | Review edge cases |
| Database schema | ✅ draft | ✅ approve migration |
| Auth / access control | ✅ draft | ✅ must review |
| Public API exposure | ✅ draft | ✅ must review |
| Production flag toggle | ❌ | ✅ required |

## Feature Flags

- `NEXT_PUBLIC_FEATURE_CROP_BULK_IMPORT` — bulk import UI
- `NEXT_PUBLIC_FEATURE_BUYER_INVENTORY_VIEW` — `/inventory` page

## Daily Rhythm

| Time | Activity |
|------|----------|
| Standup | requirements.md status |
| Morning | Cursor Agent on top priority slice |
| Midday | Validate + open PR |
| Afternoon | Update rules if patterns evolved |

## Improving the AI Layer

| Issue | Fix |
|-------|-----|
| Repeated mistake | `.cursor/rules/safrico.mdc` |
| Project conventions | `CLAUDE.md` (Cursor reads this too) |
| CI gap | GitHub Action for lint + test |

See [cursor-workflow.md](./cursor-workflow.md) for prompt templates.
