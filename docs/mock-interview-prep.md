# Mock Interview Prep — Safrico

Practice answers out loud. Target **2–3 minutes per topic**.

---

## 1. Spin up a feature from `requirements.md` (live demo)

**Prompt to interviewer:**  
*"Here's a requirements file — implement it using your AI workflow."*

**Your steps (Cursor):**

1. Open `docs/requirements-practice.md`
2. Tell Cursor Agent: *"Read @docs/requirements-practice.md and @.cursor/rules/safrico.mdc. Plan first, then implement following src/features/projects/."*
3. Run `bun run lint && npx tsc --noEmit && bun test`
4. Show result in browser or tests

**Talking points while coding:**

- "I start with requirements, not prompts"
- "I copy an existing vertical slice as the template"
- "Validate loop catches type and test failures"

---

## 2. How do you structure `.md` files?

| File | Purpose |
|------|---------|
| `PRD.md` | Vision, users, phases, out of scope |
| `requirements.md` | User story, acceptance criteria, API list |
| `requirements-v2.md` | Scope-change documentation |
| `architecture-decisions.md` | Human vs AI, security choices |
| `team-workflow.md` | SDLC for AI-augmented team |

**Answer:**  
*"PRD sets boundaries. Requirements are the contract for the Agent. Architecture decisions capture what I must review as tech lead. Scope changes get a new requirements file, not silent edits."*

---

## 3. How do you review AI-generated code?

**Checklist:**

1. **Security** — auth on routes, owner checks in service layer
2. **Correctness** — Zod at API boundary, error codes
3. **Maintainability** — vertical slice boundaries, no repository leaks
4. **Tests** — service tests mock repository; schema edge cases

**Safrico example:**  
*"Crop access is enforced in `crops.service.ts`, not only the API route. Public buyer API returns aggregates only — I reviewed that in architecture-decisions."*

---

## 4. How do you manage an AI-augmented team?

Reference `docs/team-workflow.md`:

- **Tech Lead (you)** — PRD, rules, architecture review
- **Dev** — Cursor Agent implementation
- **QA** — validate commands, flag rollout

**Answer:**  
*"AI drafts; humans approve auth, public data, and migrations. Feature flags decouple deploy from release. Every bug becomes a rule in `.cursor/rules`."*

---

## 5. Human vs AI intervention

| AI | Human |
|----|-------|
| Scaffold CRUD slice | Approve DB migration |
| Generate tests | Review auth / public routes |
| UI from shadcn patterns | Feature flag production toggle |
| Draft docs | Final architecture sign-off |

**Story:** auth.users → public.users sync bug — human caught FK failure; added `ensurePublicUser` + Supabase trigger SQL.

---

## 6. Architecture decisions (pick any two)

1. **Vertical slices** — crops separate from projects (domain clarity)
2. **Service-layer access control** — defense in depth
3. **Env-based feature flags** — simple for training, maps to LaunchDarkly in prod
4. **Buyer view aggregates only** — no PII leakage

---

## Rapid-fire Q&A

| Question | Short answer |
|----------|--------------|
| Why Bun? | Faster test/lint loop for AI self-correction |
| Why Zod v4? | Structured validation errors at API boundary |
| Why Drizzle? | Type-safe queries, schema as source of truth |
| What is PIV? | Plan → Implement → Validate |
| What would you add next? | CSV bulk import, role-based buyer login |

---

## 5-minute challenge practice file

Use [requirements-practice.md](./requirements-practice.md) — time yourself.
