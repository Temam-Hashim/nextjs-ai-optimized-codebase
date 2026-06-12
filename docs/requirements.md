# Safrico — Crop Inventory Feature

## Overview

Safrico helps farmers and agribusiness teams track crop inventory across harvest seasons. This is the first domain feature built on the AI-optimized codebase.

## User Story

**As a** farm manager,
**I want to** track crops with quantity and harvest dates,
**So that I** can plan sales, storage, and replanting.

## Requirements

- [x] List crops with name, quantity, harvest date, and crop type
- [x] Add new crops
- [x] Edit existing crops
- [x] Delete crops
- [x] Filter crops by crop type
- [x] Only the owner can modify their crops
- [x] UI dashboard page for crop management (Day 2)
- [x] Feature flag for bulk import (Day 2)
- [x] Harvest alerts within 7 days (5-min challenge)
- [x] Crop summary cards on dashboard

## Crop Types

| Type | Examples |
|------|----------|
| `grains` | Wheat, maize, rice |
| `vegetables` | Tomatoes, kale, onions |
| `fruits` | Mangoes, avocados |
| `legumes` | Beans, lentils |
| `other` | Herbs, flowers |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/crops` | List owner's crops (`?cropType=vegetables` optional) |
| POST | `/api/crops` | Create crop |
| GET | `/api/crops/[id]` | Get single crop |
| PATCH | `/api/crops/[id]` | Update crop |
| DELETE | `/api/crops/[id]` | Delete crop |

## Acceptance Criteria

- Validation errors return 400 with field details
- Unauthorized requests return 401
- Accessing another user's crop returns 403
- Missing crop returns 404
- All service logic has unit tests with mocked repository

## Implementation Notes

Follow `src/features/projects/` as the template. Use vertical slice architecture documented in `CLAUDE.md`.
