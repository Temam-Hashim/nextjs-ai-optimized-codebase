# Safrico — Product Requirements Document

## Vision

Safrico is an AI-augmented crop inventory platform for East African agribusiness. It gives small and mid-size operations a simple way to track what they have in stock, when it was harvested, and what category it belongs to.

## Problem

Farm managers track inventory in spreadsheets or paper ledgers. Data is stale, hard to filter, and not accessible to the team. They need a lightweight digital system that works on mobile and scales with their operation.

## Target Users

- **Farm managers** — own inventory, add/edit crops
- **Field supervisors** — view inventory, report harvests (future)
- **Buyers / logistics** — read-only access to available stock (future)

## MVP Scope (Day 1–2)

### In Scope

1. **Crop inventory CRUD** — name, crop type, quantity (kg), harvest date
2. **Filter by crop type** — backend filtering on list endpoint
3. **User ownership** — crops tied to authenticated Supabase user
4. **API-first** — REST endpoints following existing project patterns

### Out of Scope (Later)

- Multi-farm / organization support
- Mobile app
- Marketplace / buyer matching
- Weather and yield predictions

## Success Metrics

- Manager can add a crop in under 30 seconds
- List with filter returns in under 200ms
- 80%+ test coverage on crop service layer

## Technical Approach

Built on `nextjs-ai-optimized-codebase` using:

- Vertical slice architecture (`src/features/crops/`)
- Drizzle ORM + Supabase Postgres
- Zod validation at API boundary
- AI feedback loop: requirements.md → plan → implement → validate

## Phases

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Crop API + tests | Done |
| 2 | Dashboard UI + harvest alerts | Done |
| 3 | Feature flags (bulk import, buyer view) | Done |
| 4 | Team roles (viewer/editor) | Pending |
