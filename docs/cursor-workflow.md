# Cursor Agentic Workflow — Safrico

Cursor replaces Claude Code CLI for this portfolio. Same **PIV loop** (Plan → Implement → Validate), different UI.

## Cursor equivalents

| Workshop / Claude Code | Cursor alternative |
|------------------------|-------------------|
| `CLAUDE.md` | [CLAUDE.md](../CLAUDE.md) + [.cursor/rules/safrico.mdc](../.cursor/rules/safrico.mdc) |
| `/prime` | Chat: *“Read docs/PRD.md, docs/requirements.md, and src/features/projects/. Summarize codebase.”* |
| `/plan` | Chat (Plan mode or Agent): *“Create implementation plan from docs/requirements.md. No code yet.”* |
| `/implement` | **Agent mode** with requirements file attached (`@docs/requirements.md`) |
| `/validate` | Terminal: `bun run lint && npx tsc --noEmit && bun test` |
| `/review` | Chat: *“Review src/features/crops for security, correctness, maintainability.”* |
| `/security-review` | Chat: *“Security review: auth routes, owner checks, public /inventory API.”* |
| Global rules | `.cursor/rules/*.mdc` (always applied) |
| Skills | Cursor **Skills** (user skills) or pinned prompts in chat |
| Hooks | Cursor **Hooks** (optional — run lint on save) |

## Standard feature prompt (copy-paste)

```
Read docs/requirements.md and .cursor/rules/safrico.mdc.

Implement using the vertical slice pattern in src/features/projects/.
Run bun run lint && npx tsc --noEmit && bun test when done.
Do not import repository outside the feature slice.
```

## PIV loop in Cursor

```
1. PLAN    → Agent reads requirements.md, outputs plan (no code)
2. IMPLEMENT → Agent edits files following plan
3. VALIDATE  → Terminal checks (lint, tsc, test)
4. FIX       → Agent reads errors, fixes, re-runs until green
```

## Context loading tips

- `@docs/requirements.md` — attach spec to chat
- `@src/features/projects/` — template slice
- `@CLAUDE.md` — project conventions
- **Codebase indexing** — enabled in Cursor settings for `@codebase` search

## 5-minute mock interview flow

1. Open new `docs/requirements-practice.md`
2. Agent: *“Implement this feature in under 5 minutes using existing patterns.”*
3. Run validate commands
4. Show working result in browser or tests

## Improving the AI layer (compounding)

| Problem | Fix in Cursor |
|---------|----------------|
| Repeated mistake | Add rule to `.cursor/rules/safrico.mdc` |
| New convention | Update `CLAUDE.md` |
| Repeated workflow | Save as Cursor rule or custom instruction |
| CI gap | Add GitHub Action for lint + test |
