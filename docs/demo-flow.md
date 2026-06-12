# Safrico — Screen Recording Demo Flow

Step-by-step for the **3-minute video**. Total ~2:50 with no dead time.

## Before you hit Record

| Step | Action |
|------|--------|
| 1 | `bun run dev` — app on localhost:3000 |
| 2 | Test account logged in |
| 3 | Seed data: 2–3 crops (one harvest date within 7 days, mixed types) |
| 4 | `.env` flags: `BUYER_INVENTORY_VIEW=true`, `CROP_BULK_IMPORT=true` |
| 5 | Browser: 100% zoom, dark/light mode consistent |
| 6 | Close email/Slack notifications |

## Shot list

| Time | Screen | Action | Narration cue |
|------|--------|--------|---------------|
| 0:00 | Face or title | — | Intro name + Safrico one-liner |
| 0:20 | `/` home | Show landing | "Crop inventory for agribusiness" |
| 0:25 | `/login` → `/dashboard` | Quick login if not logged in | "Supabase auth" |
| 0:35 | `/dashboard` | Pause on alerts + summary cards | "Harvest alerts and kg by type" |
| 0:50 | `/dashboard/crops` | Scroll table | "Full inventory management" |
| 1:00 | Crops | Click **Add crop** → save (or edit existing) | "CRUD with validation" |
| 1:15 | Crops | Change **filter** dropdown | "Backend filter by crop type" |
| 1:25 | Crops | Click **Bulk import** (flag on) | "Feature-flagged rollout" |
| 1:35 | `/inventory` | Scroll buyer cards | "Read-only aggregates for buyers" |
| 1:50 | VS Code / Cursor | Open `docs/requirements.md` + `.cursor/rules` | "Requirements-driven AI" |
| 2:00 | Cursor | Show `src/features/crops/` tree | "Vertical slice pattern" |
| 2:15 | Terminal | Flash `bun test` passing (optional) | "Self-correcting feedback loop" |
| 2:30 | GitHub | Portfolio branch README | "Link in portfolio" |
| 2:45 | — | End | Thank you |

## Backup shots (if something breaks)

- API only: use browser Network tab on crop save
- Skip bulk import if dialog issues
- Show `docs/architecture-decisions.md` instead of terminal

## One-take checklist

- [ ] Harvest alert visible on dashboard
- [ ] Filter changes table rows
- [ ] `/inventory` loads without login
- [ ] No `.env` or secrets visible on screen
