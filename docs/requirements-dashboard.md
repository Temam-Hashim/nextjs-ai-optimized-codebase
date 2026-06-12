# Safrico — Crop Dashboard UI

## Status: Complete

## User Story

**As a** farm manager,
**I want to** manage crops in a web dashboard,
**So that I** don't need API tools for daily inventory work.

## Requirements

- [x] Crop list table (name, type, quantity, harvest date)
- [x] Add crop dialog
- [x] Edit crop dialog
- [x] Delete with confirmation
- [x] Filter by crop type with clear filter control
- [x] Active filter indicator
- [x] Bulk import button gated by `crop-bulk-import` feature flag
- [x] Harvest alerts banner on crops page
- [x] Toast feedback on save/delete errors

## Routes

- `/dashboard/crops` — protected crop management UI
