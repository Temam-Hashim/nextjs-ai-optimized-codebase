# Safrico — 3-Minute Intro Video Script

**Target length:** 2:45–3:00 · **Tone:** confident, technical lead  
**Record:** screen + voice (Loom, OBS, or Windows Game Bar)

---

## 0:00–0:30 — Introduce yourself

> Hi, I'm **Temam Hashim**, a full-stack engineer and tech lead.  
> I built **Safrico** — a crop inventory platform for agribusiness — as part of the Dynamous Agentic Architecture program.  
> Safrico lets farm managers track harvest stock, filter by crop type, and share a **read-only market view** with buyers, all on an AI-optimized Next.js stack.

*Optional on screen: your name + title card, or Safrico home page.*

---

## 0:30–2:00 — Project walkthrough (screen share)

**0:30** — Home page → Sign in

> Safrico uses Supabase auth and a vertical-slice architecture in Next.js.

**0:45** — **Dashboard**

> The dashboard shows **harvest alerts** for crops due within seven days, and **summary cards** with total kilograms by crop type.

**1:00** — **Crops page** (`/dashboard/crops`)

> Managers can add, edit, delete, and **filter by crop type**.  
> All data goes through a REST API with Zod validation and owner-scoped access in the service layer.

*Demo: add or edit one crop, apply a filter.*

**1:30** — **Buyer inventory** (`/inventory`)

> Mid-sprint we added a scope change: a **buyer read-only view** with aggregated totals only — no farm or owner details.  
> It's behind a **feature flag** so we can roll out safely.

**1:50** — Quick flash: `docs/` folder or `.cursor/rules`

> Every feature started from structured markdown — PRD, requirements, architecture decisions.

---

## 2:00–2:45 — Agentic workflow

> My workflow is **requirements first, then PIV** — Plan, Implement, Validate.  
> I use **Cursor** as my AI editor: project rules in `.cursor/rules`, specs in `docs/requirements.md`, and the Agent implements vertical slices matching existing patterns.  
> TypeScript strict mode, Biome, and Bun tests create a **self-correction loop** — the AI reads errors and fixes until green.  
> I decide where humans must intervene: auth, public APIs, and database migrations. That's documented in `architecture-decisions.md`.

---

## 2:45–3:00 — Close

> Repo link is in my portfolio branch on GitHub.  
> Thanks — happy to walk through a live five-minute feature spin-up in the mock interview.

*End on README or GitHub repo page.*

---

## Recording tips

- Rehearse once without recording (~5 min)
- Speak slightly slower than normal
- If you stumble, pause 2 seconds and repeat the sentence — edit in post
- Export 1080p, upload unlisted, add link to README
