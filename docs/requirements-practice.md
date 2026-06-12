# Practice Feature — Crop Export (Mock Interview)

**Time limit:** 5 minutes · **Tool:** Cursor Agent

## User Story

**As a** farm manager,  
**I want to** export my crop list as JSON from the API,  
**So that** I can back up inventory or integrate with other tools.

## Acceptance Criteria

- [ ] `GET /api/crops/export` returns all owner's crops as JSON array
- [ ] Requires authentication (401 if not logged in)
- [ ] Response includes: id, name, cropType, quantity, harvestDate
- [ ] Follow vertical slice pattern — add `exportCrops` to service, route in `src/app/api/crops/export/route.ts`
- [ ] No new database tables

## Out of Scope

- CSV format
- UI download button

## Cursor prompt

```
Implement docs/requirements-practice.md following .cursor/rules/safrico.mdc.
Use src/features/crops/ and src/features/projects/ as templates.
Run bun run lint && npx tsc --noEmit && bun test when done.
```
