# LP-LIVE-DECK

A live, public LP pitch deck for Signals Over Stories (Sevda Anefi · European early-stage AI VC).
The page is the pitch: Notion DBs → Next.js ISR (60s) → editorial-magazine layout. Every company
logged or signal recorded re-renders this site inside a minute.

## Commands

```bash
npm install
npm run dev          # Next dev @ http://localhost:3000
npm run build        # Production build
npm run type-check   # tsc --noEmit — run before every commit
npm run lint         # eslint-config-next
```

Deploy: `vercel deploy --prod` (requires `vercel link` + `vercel env add` for all 5 vars first).

## Architecture

**Data layer — all in `src/lib/notion.ts`**

- One typed fetcher per section: `getHeroStats`, `getTheses`, `getPipeline`, `getFunnel`,
  `getSignalVelocity`, `getTopByScore`, `getLatestPosts`, `getInfraCounts`, `getScouting`.
- Every fetcher wraps in try/catch and returns a typed empty-state object on failure — never throws.
- Uses `@notionhq/client` v5: `client.dataSources.query({ data_source_id })`. **Not** `databases.query`.
  Env vars store data-source UUIDs directly, not parent DB IDs.

**Rendering**

- `src/app/page.tsx` is the single orchestrator — `export const revalidate = 60`, `Promise.all` of the
  9 fetchers, then passes typed props to sections.
- **8 sections in narrative order**: Hero (00) · Thesis (02) · Pipeline (03) · Funnel (04) · Velocity
  (05) · TrackRecord (06) · Infrastructure (07, also renders live Scouting Engine) · Writing (08).
  `TOTAL_SECTIONS = 8` in `SectionHeader.tsx`; footer reads `08 / 08`.
- `src/sections/*.tsx` — Server Components. Layout + copy. Receive props, never fetch directly.
- `src/components/*.tsx` — Client Components where interaction/motion is needed (`"use client"`).
- Error boundary: `src/app/error.tsx` plus per-section fallback via typed empty states.

**Design tokens — `src/app/globals.css`**

- Tailwind v4 CSS-first theme (`@theme` block, no `tailwind.config.js`).
- Colors in OKLCH: `--color-paper` (warm cream), `--color-ink` (near-black), `--color-signal` (red —
  reserved for HOT / P0 / alerts).
- Fonts via `next/font/google`: Fraunces (display), Instrument Sans (body), JetBrains Mono (meta).
- Editorial utilities live in `@layer utilities`: `.drop-cap`, `.spine-label`, `.folio`, `.hero-rise`
  (page-load stagger), `.live-sweep`, `.scroll-hint`, `.link-editorial`.

## Notion data model

Schemas verified 2026-04-12. Four sources, only one env var per source:

| Env var                      | What it points to                                          |
| ---------------------------- | ---------------------------------------------------------- |
| `NOTION_TOKEN`               | Internal integration token (workspace-scoped)              |
| `NOTION_DEALFLOW_DB`         | Data-source ID for the Pipeline / Dealflow DB              |
| `NOTION_SIGNAL_DB`           | Data-source ID for the Signal Log DB                       |
| `NOTION_THESIS_PACK_PAGE`    | **Page ID** for the "Investment Thesis Pack" page          |
| `NOTION_BLOG_DB`             | Data-source ID for the Writing DB                          |

**Theses are not a DB** — they live as callouts inside a `column_list` on a single page. Extraction
walks `blocks.children.list(packPage)` → columns → callouts, reads color (maps to `VisualStyle`), and
follows `has_children` on each callout for body paragraphs.

**Thesis title ↔ Dealflow enum aliasing** — child_page titles on the Thesis Pack don't equal the
Dealflow `Thesis` multi-select values. Alias maps live in `src/lib/notion.ts`
(`THESIS_COMPANY_ALIASES` / `THESIS_SIGNAL_ALIASES`):
- "The Compliance AI Moat" ↔ "Compliance AI Moat" (+ "Both" for companies)
- "Vertical AI in Regulated Industries" ↔ same (+ "Both" for companies)
- "AI Evaluation & Production Infrastructure" ↔ "AI Eval & Testing Infrastructure"
Signal Log `Thesis Relevance` lacks "Both" — never add it to the signal alias map.

## Gotchas

- **SDK is v5.** If migration notes reference `databases.query({ database_id })`, that's v2.3.x —
  don't copy.
- **Data-source ID ≠ parent DB ID.** For single-data-source DBs they look similar, but are not
  interchangeable. Retrieve the data-source UUID via `notion.databases.retrieve(parentDbId)` if
  adding a new DB.
- **Never round SSI scores** — render whatever Notion returns (see `.claude/rules/architecture.md`).
- **`hero.generatedAt` is always set** — both success and error paths return
  `new Date().toISOString()`. Safe to pass to `new Date(...)` without guards.
- **`LiveStatusBar` hydration warning is pre-existing** — `useState(() => Date.now())` diverges
  between SSR and CSR. React recovers on first tick; not worth fixing for a 1-page app.
- **`useInView` fires on geometry, not opacity.** If a parent uses `hero-rise` / motion stagger to
  reveal, pass a matching `delay` to child `NumberCounter`s so the count-up doesn't finish before the
  parent fades in.
- **`.claude/rules/*.md` is auto-loaded** by Claude Code (`architecture.md` / `design.md` /
  `quality.md`) — don't duplicate its content here, just reference.
- **Tailwind v4 is CSS-first.** No `tailwind.config.js`. Extend tokens in `@theme { ... }` inside
  `globals.css`. Arbitrary values like `text-[var(--color-ink)]` work and are preferred over one-off
  utilities.
- **Dynamic Tailwind class names don't JIT-scan.** For grid placement use inline `style={{
  gridColumnStart: n }}` rather than `md:col-start-${n}`.
- **Next.js HMR can corrupt `.next/` manifests** on rapid file edits — symptom is a 500 +
  `SyntaxError: Unexpected end of JSON input at loadManifest`. Fix: stop dev server,
  `rm -rf .next`, restart. Not a code bug.
- **TS `noUncheckedIndexedAccess` doesn't flow-narrow** after `if (i > 0)` — `arr[i-1]` is still
  typed as possibly-undefined. Destructure into a local: `const prev = i > 0 ? arr[i-1] : undefined;`
  then use `prev?.field`.
- **Rich Notion fields are populated sparsely.** `Pass Reason`, `Discovery Source`, `Action Taken`,
  `Kill Criteria`, `Outreach Sent` are all partially filled. UI renders correct empty-states —
  filling these in Notion lights up existing sections with zero code changes (the point of
  "the tool is the pitch").

## File map

```
src/
├── app/
│   ├── page.tsx              # Orchestrator · ISR revalidate=60
│   ├── layout.tsx            # Fonts · OG metadata
│   ├── globals.css           # Tailwind v4 @theme · editorial utilities
│   ├── error.tsx             # Page-level error boundary
│   ├── not-found.tsx
│   └── opengraph-image.tsx   # Dynamic OG with live pipeline count
├── sections/                 # Server Components (1 per section)
│   ├── Hero.tsx
│   ├── Thesis.tsx            # renders cross-DB evidence per thesis
│   ├── Pipeline.tsx
│   ├── Funnel.tsx            # pass discipline: 5-stage funnel + Pass Reason bars
│   ├── SignalVelocity.tsx
│   ├── TrackRecord.tsx
│   ├── Infrastructure.tsx    # static node flow + live Scouting Engine breakdown
│   └── Writing.tsx
├── components/               # Client Components (motion · charts · counters)
├── lib/
│   ├── notion.ts             # All Notion queries — one fn per section
│   ├── ssi.ts                # Heat tier logic (HOT/WARM/WATCH/EARLY)
│   ├── types.ts              # Shared domain types
│   └── env.ts                # Typed env · fail-fast on missing vars
└── env.ts                    # (legacy location — see src/env.ts)
```

## Workflow

- **Feature work** — branch `feat/<scope>`, commit `feat(<scope>): ...`. Never commit to `main`.
- **Before every commit** — `npm run type-check` must be clean.
- **Before every deploy** — see `.claude/rules/quality.md` checklist (Lighthouse ≥90 across Perf /
  A11y / Best Practices, responsive at 375/768/1440, error boundaries verified by killing
  `NOTION_TOKEN` locally).
- **Adding a new Notion DB** — (1) retrieve it via MCP / API, (2) store the data-source UUID (not
  the DB ID) in `.env.local` + `.env.example`, (3) add the key to `required` in `src/env.ts`, (4)
  write the fetcher in `src/lib/notion.ts` with a typed empty-state fallback.
