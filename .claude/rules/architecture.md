---
# Applies to all files in src/
globs: ["src/**"]
---

## Data Layer
- ALL Notion queries in `src/lib/notion.ts` — one function per section
- Every fetch: `next: { revalidate: 60 }` — non-negotiable
- Fetch functions return typed interfaces, never raw Notion API objects
- Error boundaries on every section — graceful degradation, never a blank section

## Section Pattern
1. `src/sections/[Name].tsx` — Server Component, receives typed props
2. `src/components/[Name].tsx` — Client Components marked "use client"
3. Wire in `src/app/page.tsx` — single Server Component orchestrator
4. Framer Motion scroll reveal on every section
5. `npm run type-check` — zero errors before moving to next section

## SSI Logic
All SSI logic in `src/lib/ssi.ts`.
Exports: `getHeatTier(score)`, `getHeatColor(tier)`, `formatSSI(score)`
Tiers: HOT ≥75 · WARM 60–74 · WATCH 45–59 · EARLY <45
Numbers: never round. Show exactly what Notion returns.