# Safrico — AI-Augmented Crop Inventory

Safrico is a crop inventory platform for agribusiness, built on an **AI-optimized Next.js** starter. It demonstrates how structured `.md` requirements drive agentic development with self-correcting TypeScript, Zod, and tests.

## What it does

- **Farm managers** — CRUD crop inventory, filter by type, harvest alerts
- **Buyers** — read-only market view with aggregated kg by crop type (feature-flagged)
- **Tech leads** — vertical slices, feature flags, documented AI workflow

## Agentic workflow

```
docs/requirements.md → /plan → /implement → /validate → /review
```

| Asset | Purpose |
|-------|---------|
| [docs/PRD.md](./docs/PRD.md) | Product vision |
| [docs/requirements.md](./docs/requirements.md) | Feature spec |
| [docs/team-workflow.md](./docs/team-workflow.md) | 3-person AI-augmented SDLC |
| [docs/architecture-decisions.md](./docs/architecture-decisions.md) | Human vs AI decisions |
| [CLAUDE.md](./CLAUDE.md) | Claude Code rules |
| [.cursor/rules/](./.cursor/rules/) | Cursor agent rules |
| [.claude/commands/](./.claude/commands/) | Slash commands (`/prime`, `/validate`, …) |

## Stack

Next.js 16 · Bun · Drizzle · Supabase · Zod · Biome · shadcn/ui

## Quick start

```bash
bun install
cp .env.example .env
# Add Supabase URL, anon key, DATABASE_URL

# Apply schema (SQL in drizzle/migrations/0001_safrico_crops.sql if db:push fails)
bun run db:push

bun run dev
```

Open [http://localhost:3000](http://localhost:3000) → register → **Dashboard** → **Crops**.

## Feature flags

Set in `.env`:

```bash
NEXT_PUBLIC_FEATURE_CROP_BULK_IMPORT=true      # Shows bulk import button
NEXT_PUBLIC_FEATURE_BUYER_INVENTORY_VIEW=true  # Enables /inventory buyer page
```

Restart dev server after changing flags.

## Key routes

| Route | Access | Description |
|-------|--------|-------------|
| `/dashboard` | Auth | Summary cards + harvest alerts |
| `/dashboard/crops` | Auth | Full crop management UI |
| `/inventory` | Public (flag) | Buyer read-only aggregates |
| `/api/crops` | Auth | REST CRUD + `?cropType=` filter |
| `/api/crops/alerts` | Auth | Harvests within 7 days |
| `/api/crops/summary` | Auth | Kg by type for owner |
| `/api/inventory/summary` | Public (flag) | Market aggregates |

## Architecture

Vertical slices in `src/features/`:

```
features/crops/
├── models.ts       → Drizzle types
├── schemas.ts      → Zod validation
├── repository.ts   → DB queries
├── service.ts      → Business logic + access control
├── errors.ts       → HTTP error types
├── components/     → Dashboard UI
└── tests/          → Executable specs
```

## Commands

```bash
bun run dev          # Development server
bun run lint         # Biome check
bun test             # Unit tests
npx tsc --noEmit     # Type check
bun run db:push      # Push schema to Supabase
```

## AI fluency highlights

1. **Requirements-first** — every feature starts in `docs/*.md`
2. **Self-correction** — strict TS + Biome + Bun tests create machine-readable feedback
3. **Feature flags** — safe rollout pattern for buyer view and bulk import
4. **Scope change** — `requirements-v2.md` documents mid-sprint buyer view addition
5. **Human gates** — auth, public routes, and migrations require human review

## Training context

Built for **Dynamous Senior Tech Lead — Agentic Architecture** program (Track A).

- Day 1: Foundations, crops API, AI layer
- Day 2: Dashboard UI, flags, harvest alerts, buyer view, portfolio docs
- Day 3: Video + mock interview

See [docs/day-2-checklist.md](./docs/day-2-checklist.md) for deliverable status.

## License

Private / training project.
