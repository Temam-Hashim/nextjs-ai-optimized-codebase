# Safrico — Harvest Alerts (5-Minute Challenge)

## Status: Complete

## User Story

**As a** farm manager,
**I want to** see which crops harvest within 7 days,
**So that I** can plan logistics before stock spoils.

## Requirements

- [x] API `GET /api/crops/alerts` returns crops harvesting within 7 days
- [x] Each alert includes name, type, quantity, days until harvest
- [x] Dashboard and crops page show alert banner when alerts exist
- [x] Urgent styling for harvests within 2 days
- [x] Service unit tests with mocked repository

## Implementation Time

Built using requirements.md → vertical slice extension pattern (~5 min workflow target for interview practice).
