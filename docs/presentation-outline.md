# Final Presentation Outline — Safrico (10 min)

For cohort peer review. Adjust timing to facilitator's slot.

---

## Slide / section 1 — Who & what (1 min)

- **Name:** Temam Hashim · Full-stack / tech lead
- **Project:** Safrico — crop inventory for agribusiness
- **Stack:** Next.js 16, Supabase, Drizzle, Cursor-driven development

---

## Slide 2 — Problem & solution (1 min)

- **Problem:** Paper/spreadsheet inventory doesn't scale; buyers need market visibility
- **MVP:** Manager CRUD + filters + harvest alerts + buyer read-only aggregates
- **Demo screenshot:** dashboard or crops table

---

## Slide 3 — Live demo (3 min)

Follow [demo-flow.md](./demo-flow.md) — shortened:

1. Dashboard (alerts + summary)
2. Crops CRUD + filter
3. `/inventory` buyer view
4. Feature flag mention

---

## Slide 4 — Agentic workflow (2 min)

```
docs/requirements.md → Cursor Agent (PIV) → lint + tsc + test
```

- `.cursor/rules/safrico.mdc` — persistent AI layer
- `architecture-decisions.md` — human gates
- Example: scope change v2 (buyer view) documented in `requirements-v2.md`

---

## Slide 5 — Team leadership (1.5 min)

- 3-person model: Lead / Dev / QA
- Feature flags for safe rollout
- When AI ships vs when human reviews

---

## Slide 6 — Lessons & next steps (1 min)

- **Worked:** vertical slices, requirements-first, test feedback loop
- **Learned:** auth.users ↔ public.users sync (FK on crops)
- **Next:** bulk CSV import, buyer auth, feature-flag exercise completion

---

## Slide 7 — Q&A (1.5 min)

See [mock-interview-prep.md](./mock-interview-prep.md)

---

## Peer review rubric (self-check)

| Criteria | Evidence |
|----------|----------|
| Communication clarity | Demo flow, video script |
| Technical depth | API + service + tests + flags |
| AI fluency | cursor-workflow.md, rules, requirements chain |
