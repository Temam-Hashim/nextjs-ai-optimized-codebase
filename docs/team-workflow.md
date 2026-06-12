# AI-Augmented Team Workflow — Safrico (3-Person Team)

## Team Roles

| Role | Person | Primary Tool | Responsibility |
|------|--------|--------------|----------------|
| **Tech Lead** | You | Claude Code CLI + Cursor | Architecture, PRDs, code review, AI layer maintenance |
| **Full-Stack Dev** | Dev 2 | Cursor | Feature implementation, UI, integration |
| **QA / DevOps** | Dev 3 | Copilot + GitHub | Tests, CI/CD, feature flag rollout, security review |

## SDLC Flow: PRD → PIV

```
PRD (docs/PRD.md)
  ↓
/plan (Claude Code) — implementation plan from requirements
  ↓
/implement (Claude Code) or Cursor Agent — write code
  ↓
/validate — lint + typecheck + tests
  ↓
/review + /security-review — human + AI review
  ↓
PR → merge behind feature flag → production
```

### 1. Plan (Human + Claude Code)

- Tech Lead writes or refines `docs/requirements.md`
- Run `/prd-interactive` or `/create-prd` for new features
- Run `/plan docs/requirements.md` to generate implementation plan
- Dev 2 reviews plan before coding starts

### 2. Implement (Cursor + Claude Code)

- **Cursor Agent**: day-to-day feature work inside the IDE (fast iteration, multi-file edits)
- **Claude Code CLI**: complex multi-step tasks, `/implement` from plan, repo-wide refactors
- **Copilot**: inline completions, boilerplate, test scaffolding for Dev 3

### 3. Validate (Automated + Human)

- Every PR runs: `bun run lint && npx tsc --noEmit && bun test`
- Claude `/validate` before opening PR
- Dev 3 runs `/security-review` on auth and data-access changes
- Tech Lead approves architecture deviations

## Human vs AI Intervention

| Task | AI | Human |
|------|-----|-------|
| Scaffold feature slice from requirements | ✅ | Review structure |
| CRUD API + Zod schemas | ✅ | Review business rules |
| Unit tests (mocked repository) | ✅ | Review edge cases |
| Database schema design | ✅ draft | ✅ approve migrations |
| Auth / access control | ✅ draft | ✅ must review |
| Security-sensitive code | ❌ | ✅ required |
| Architecture decisions | ✅ options | ✅ final call |
| Production deploy / flag toggle | ❌ | ✅ required |
| Scope change mid-sprint | ✅ re-plan | ✅ reprioritize |

## Feature Flags for Safe Rollout

1. New features ship behind flags (see `nextjs-feature-flag-exercise` patterns)
2. Dev 3 enables flag in staging first
3. Tech Lead approves production enable
4. Rollback = disable flag, not revert deploy

Example flags for Safrico:

- `crop-inventory-v1` — crop API and UI
- `crop-bulk-import` — CSV import (Day 2)

## Daily Rhythm

| Time | Activity |
|------|----------|
| Standup | Review requirements.md status, blockers |
| Morning | `/prime` + implement highest-priority slice |
| Midday | `/validate`, open PRs |
| Afternoon | Code review, update CLAUDE.md if patterns evolved |
| End of day | Update docs, commit with clear messages |

## Improving the AI Layer

Every bug or repeated mistake becomes a rule:

- Fix in code → add to `CLAUDE.md` or `.cursor/rules/`
- Repeated workflow → new slash command in `.claude/commands/`
- Repeated validation → hook or CI check

This compounds: the system gets more reliable each sprint.
