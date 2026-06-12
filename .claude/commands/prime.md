---
description: Prime agent with Safrico codebase understanding
argument-hint: [optional context file path]
---

# Prime: Load Safrico Project Context

**Input**: $ARGUMENTS

## Objective

Build comprehensive understanding of this AI-optimized Next.js codebase before implementing features.

## Process

### Step 0: Load External Context (if provided)

If a file path is provided (e.g., `docs/requirements.md`, `docs/PRD.md`), read it first and use it to inform your understanding.

### Step 1: Analyze the Codebase

1. Read `CLAUDE.md` and `CODEBASE-GUIDE.md` (sections 1–5)
2. Study `src/core/` — config, database, logging, supabase, api errors
3. Study one complete feature slice: `src/features/projects/`
4. Check `src/app/api/` for route patterns
5. Check recent commits with `git log --oneline -5`

### Step 2: Safrico Domain

1. Read `docs/PRD.md` and `docs/requirements.md`
2. Note implemented vs pending features in `src/features/`

## Output

Produce a scannable summary:

- **Project Purpose**: One sentence (Safrico crop inventory)
- **Tech Stack**: Next.js 16, Bun, Drizzle, Supabase, Zod, Biome
- **Data Model**: users, projects, crops (+ relationships)
- **Key Patterns**: vertical slices, repository/service split, Zod validation
- **Current State**: branch, recent work, next requirement to implement

Use bullet points. Keep it concise.
