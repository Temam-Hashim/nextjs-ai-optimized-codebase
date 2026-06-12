# Safrico — Architecture Decisions

Decisions from Day 1–2 development. Format: what AI did, what human reviewed, and why.

---

## 1. Vertical slice for crops (not extending projects)

| | |
|---|---|
| **AI did** | Copied `src/features/projects/` structure for `src/features/crops/` |
| **Human did** | Chose separate slice instead of nesting crops under projects — farms are not "projects" in the domain |
| **Why** | Keeps domain language clear; features can be deleted or extracted independently |

---

## 2. Owner-scoped access in service layer

| | |
|---|---|
| **AI did** | Generated `getCrop`, `updateCrop`, `deleteCrop` with owner checks in service |
| **Human did** | Verified checks live in service, not only API routes |
| **Why** | Defense in depth — routes can change; service is the authority for business rules |

---

## 3. Public buyer view exposes aggregates only

| | |
|---|---|
| **AI did** | `getPublicSummaryByType()` — `GROUP BY crop_type` with `SUM(quantity)` |
| **Human did** | Rejected any endpoint returning individual crop rows to unauthenticated users |
| **Why** | Buyers need market signal, not competitor farm-level data (PII / business sensitivity) |

---

## 4. Feature flags via environment variables

| | |
|---|---|
| **AI did** | `src/core/feature-flags/` reading `NEXT_PUBLIC_FEATURE_*` |
| **Human did** | Chose env flags over external service for training scope; documented in README |
| **Why** | Zero infra for workshop; pattern maps to LaunchDarkly/Unleash in production |

---

## 5. Client dashboard calls REST API (not server actions for CRUD)

| | |
|---|---|
| **AI did** | `CropsDashboard` client component fetches `/api/crops` |
| **Human did** | Accepted trade-off: slightly more round-trips, clearer API demo for portfolio |
| **Why** | Day 2 demo shows full stack; API is reusable for mobile later |

---

## 6. Harvest alerts computed in service, not SQL

| | |
|---|---|
| **AI did** | Repository filters date range; service computes `daysUntilHarvest` |
| **Human did** | Approved for MVP; noted SQL `EXTRACT(DAY FROM …)` optimization for scale |
| **Why** | Readable logic for tests; easy to change alert window from 7 to 14 days |

---

## 7. Human review required for auth and public routes

| | |
|---|---|
| **AI did** | Scaffolded `/inventory` and `/api/inventory/summary` |
| **Human must** | Review before production — confirm flag default, rate limiting, data policy |
| **Why** | Public routes are high-risk; AI drafts, human approves |

---

## When to use AI vs human (summary)

| Use AI | Human required |
|--------|----------------|
| Scaffold slices from requirements.md | Approve schema migrations |
| CRUD + Zod + tests | Auth and public data exposure |
| UI from existing shadcn patterns | Feature flag rollout to production |
| README and docs drafts | Security review before deploy |
