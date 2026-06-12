# Safrico — Scope Change v2: Buyer Read-Only Inventory

## Status: Complete

## Stakeholder Request (Mid-Sprint)

> "We need a read-only dashboard for buyers — they can see total inventory by crop type but cannot edit or see farm details."

## User Story

**As a** produce buyer,
**I want to** view aggregated crop availability by type,
**So that I** can plan purchases without accessing farm operations.

## Acceptance Criteria

- [x] Public page `/inventory` (no login required)
- [x] Shows total kg per crop type across all farms
- [x] Does **not** expose owner IDs, farm names, or individual crop records
- [x] Gated by `buyer-inventory-view` feature flag
- [x] API returns 404 when flag disabled
- [x] Dashboard links to buyer view when flag enabled
- [x] Clear "Buyer view · Read only" labeling

## Out of Scope (v2)

- Buyer authentication
- Per-farm breakdown
- Purchase orders

## Re-Planning Notes (Tech Lead)

1. Updated PRD phase 3 → shipped early as scope change
2. AI implemented aggregation query + public page
3. Human approved: no PII in public API response
4. Feature flag allows instant rollback if buyers should not see data yet
