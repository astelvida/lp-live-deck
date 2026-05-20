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
npm run lint         # eslint . — ESLint 9 flat config
```

Deploy: `git push origin main` auto-deploys to production via the GitHub integration wired
at `vercel link` time. Manual redeploy: `vercel deploy --prod --yes`. Live URL:
https://lp-live-deck.vercel.app. Project: `astelvidas-projects/lp-live-deck`. First-time
setup (already done): `vercel link` + push production env vars for `NOTION_TOKEN`,
`NOTION_DEALFLOW_DB`, `NOTION_SIGNAL_DB`, `NOTION_THESIS_PACK_PAGE`, `NOTION_BLOG_DB`,
`NEXT_PUBLIC_SITE_URL`. Preview + development scopes are currently unpopulated — only
affects branch-preview deploys and `vercel dev` (not `npm run dev`).

## Architecture

**Data layer — all in `src/lib/notion.ts`**

- One typed fetcher per section: `getHeroData`, `getPipeline`, `getTheses`, `getSignalVelocity`,
  `getEvidenceData`, `getLatestPosts`.
- Every fetcher wraps in try/catch and returns a typed empty-state object on failure — never throws.
- Uses `@notionhq/client` v5: `client.dataSources.query({ data_source_id })`. **Not** `databases.query`.
  Env vars store data-source UUIDs directly, not parent DB IDs.
- Canonical thesis names live in `src/lib/thesis-canon.ts` as a `const` tuple
  (`["Governed Agentic Ops", "Vertical SoR AI"]`) and MUST match the Notion `Thesis` /
  `Thesis Relevance` multi-select values exactly. Rename in one place without the other and the
  deck silently drops rows.

**Rendering**

- `src/app/page.tsx` is the single orchestrator — `export const revalidate = 60`, `Promise.all` of
  the 6 fetchers, then passes typed props to sections.
- **6 sections in narrative order**: Hero (01, dark) · Pipeline (02) · Thesis (03) · Velocity (04,
  dark) · Evidence (05) · Writing (06). `TOTAL_SECTIONS = 6` in `SectionHeader.tsx`; footer reads
  `06 / 06`. Hero and Velocity use the `.surface-deep` utility for full-bleed dark sections; the
  rest stay light cream.
- `src/sections/*.tsx` — Server Components. Layout + copy. Receive props, never fetch directly.
  Evidence is the lone exception: it renders the `EvidenceTable` client component from
  `src/components/evidence/` — a Harmonic/PitchBook-shaped dense table with sortable columns,
  4 view presets, inline-expand rows, and 6 filter dimensions. See the **Evidence table**
  section below for the column model + extension points.
- `src/components/*.tsx` — Client Components where interaction/motion is needed (`"use client"`).
- Error boundary: `src/app/error.tsx` plus per-section fallback via typed empty states.

**Design tokens — `src/app/globals.css`**

- Tailwind v4 CSS-first theme (`@theme` block, no `tailwind.config.js`).
- Light theme: `--color-paper` (warm cream), `--color-ink` (near-black), `--color-signal` (red —
  reserved for P0 / alerts / consensus emphasis).
- Dark theme tokens — applied only inside `.surface-deep` wrappers (Hero + Velocity):
  `--color-ink-deep` (#0a0a0a bg), `--color-ink-deep-soft` (#141414 inner panels),
  `--color-paper-on-deep` (#FAFAF7 text), `--color-paper-on-deep-mute` / `-soft`,
  `--color-rule-on-deep`, `--color-live-green`, `--color-amber`.
- Fonts via `next/font/google`: Fraunces (display), Instrument Sans (body), JetBrains Mono (meta).
- Editorial utilities live in `@layer utilities`: `.drop-cap`, `.spine-label`, `.folio`, `.hero-rise`
  (page-load stagger), `.live-sweep`, `.scroll-hint`, `.link-editorial`, `.surface-deep`, `.reg-pill`.

## Notion data model

Schemas verified 2026-05-19 against **Two-Thesis Canonical v2.0**. Four sources, one env var each:

| Env var                      | What it points to                                          |
| ---------------------------- | ---------------------------------------------------------- |
| `NOTION_TOKEN`               | Internal integration token (workspace-scoped)              |
| `NOTION_DEALFLOW_DB`         | Data-source ID for the Companies DB                        |
| `NOTION_SIGNAL_DB`           | Data-source ID for the Signals DB                          |
| `NOTION_THESIS_PACK_PAGE`    | **Page ID** of "Investment Thesis Pack — Two-Thesis Canonical v2.0" (`973bfd70-26b4-4111-9d88-f633e641c186`) |
| `NOTION_BLOG_DB`             | Data-source ID for the Writing DB                          |

**Companies fields the deck reads** (Dealflow DB): `Company` (title), `SSI Score` (number),
`Adjusted SSI` (formula = Raw SSI × confidence factor), `Source confidence` (High/Medium/Low →
1.0×/0.85×/0.6×), `Priority` (P0/P1/P2/P3 + suffix), `Signal Tier`, `Status`, `Stage`, `Sector`,
`Thesis` multi-select, `One-liner`, `HQ`, `Website`, `Signal Count` (rollup), `Key Signal 30d`,
`Last Signal Date` (rollup), `Falsifier Check` (Clean/Triggered/Not Run), `Anti-thesis Filter`
(Clear/1 Flag/Auto-pass/Not Run), `IC Memo Status` (Not Started/Draft/In Review/Approved/Passed),
`Discovery Source`, `Headcount`, `Founded`, `Last Raise`, `Last Scored`.

**v3 Companies fields used by the Evidence table** (some require Notion schema additions —
see "Evidence table" below): `LinkedIn URL`, `Raising Likelihood` (Low/Medium/High/Active),
`Next Action`, `Idle Days` (formula), `Catalyst Window (days)`, `Primary Catalyst` (relation;
title-resolution deferred), `Stack RE Vector` (Customer/Competitor/Tech partner), `Pass Reason`,
`Last verified`. Tier 1 manual-entry additions: `Founders` (rich_text), `Founder Highlights`
(multi_select), `Customer Type` (B2B/B2C/B2G/B2B+B2C/B2B+B2G), `Total Funding USD`,
`Last Round Amount USD`, `Last Round Date`, `Notable Investors` (multi_select),
`Ownership` (Private/Public/Acquired/Dead·Defunct/Stealth), `Founder LinkedIn`. Tier 2
traction/momentum (render empty-state until populated): `Headcount 90d Δ %`, `LinkedIn Followers`,
`LinkedIn Followers 90d Δ %`, `GitHub Stars`, `Web Traffic Trend` (Up/Flat/Down/N/A). All reads
gracefully return `null` when the property doesn't exist yet, so adding the Notion column is the
only step needed to light up a field.

**Signals fields the deck reads**: `Signal` (title), `Detail`, `Date Detected`, `Week`,
`Signal Type`, `Signal Strength`, `Thesis Relevance` (multi-select), `Source Channel`, `Source URL`,
`Novelty` (New/Repeated/Escalating), `Evidence Quality` (Primary/Secondary/Tertiary),
`Evidence Source Type`, `Memo Candidate` (checkbox), `Disqualifying` (checkbox), `Verified`
(checkbox), `Action Taken`.

**Theses live on a single page**, not a DB. The current page (`973bfd70...`) uses H1 sections
("Thesis A: Governed Agentic Ops", "Thesis B: Vertical System-of-Record AI") with bolded
`**Core Bet:**` / `**Anti-thesis:**` / `**What we underwrite:**` paragraphs + bulleted sub-segments.
`extractTheses()` walks top-level blocks, slurps everything between `heading_1` markers, then
overlays the parsed text onto canonical defaults in `src/lib/thesis-canon.ts` — so a parser miss
falls back to the canon defaults rather than blanking the section.

**Thesis name aliasing** — the canonical names (`"Governed Agentic Ops"` and `"Vertical SoR AI"`)
are defined as a `const` tuple in `src/lib/thesis-canon.ts` and matched directly against the Notion
`Thesis` (Companies) / `Thesis Relevance` (Signals) multi-select values. The Companies DB has a
`"Both"` option that maps to both theses; Signals lack `"Both"` (per design). When renaming a
canonical name, change it in `thesis-canon.ts` AND in both Notion multi-selects in lockstep.

## Evidence table

The 05 section is a Harmonic/PitchBook-shaped dense data table living at
`src/components/evidence/`. Anatomy:

- **Source of truth** — `evidence/columnModel.ts` declares each column once with
  `presets: PresetId[] | "all"` controlling visibility. **Adding a column** means three edits in
  lockstep: (1) extend `ColumnKey` here, (2) add a `case` to the `Cell` switch in `EvidenceRow.tsx`,
  (3) add a `case` to `sortValue()` in `EvidenceTable.tsx` if sortable.
- **Brutalist shell** — the table sits in a `border-2` ink frame with a solid black `<thead>`
  band (`bg-[var(--color-ink)]`, light text); `SortableTh` + the plain `<th>` paint their sticky
  backgrounds ink to match. Each row carries a 2-digit mono folio (`01`…`NN`) and the Adj.SSI bar
  is rescaled from a 35 floor (`SSI_FLOOR` in `EvidenceRow.tsx`) so clustered 65–90 scores show
  real spread; bar colour tracks the priority tier.
- **`ConvictionDistribution`** — a Recharts `BarChart` strip between the filter bar and the table,
  fed by the *visible* (filtered + sorted) rows. Six adjusted-SSI buckets (35→95+); re-animates on
  every filter / preset change. This is the deck's only per-row-context chart in Evidence.
- **`recentSignals` is always empty** — `getEvidenceData` maps signals to companies by the
  `company` rich-text field on the Signals DB, but that field is unpopulated on every signal
  (the real link is a Notion relation, unresolved — see the comment near line 1129 of `notion.ts`).
  So `EvidenceCompany.recentSignals` is `[]` for all rows today. Don't build per-company signal
  UI on it (a velocity sparkline was tried and dropped for this reason); resolve the relation in
  `getEvidenceData` first if per-company signals are needed.
- **Presets** — Sourcing (default · discovery, raising, idle), IC Prep (falsifier, anti-thesis,
  memo, funding), Founders (team highlights, customer type), Catalyst (countdown, traction Δ).
  Selected via the `ViewPresetSwitcher` segmented control. State in `useState`; no URL params,
  no localStorage.
- **Sticky columns** — Company (left: 0), Thesis (left: 220), Adj.SSI (left: 300). CSS
  `position: sticky` only. Together they consume ~460px of fixed width, leaving ~980px scrollable
  at 1440. The sticky background must match the row background — `<td>` style switches between
  `var(--color-signal-soft)` (expanded), the P0 highlight tone, or plain white.
- **Inline expand** — `<AnimatePresence>` + a `motion.div` with `height: 0 → "auto"` and 200ms
  ease-out. Multiple rows can be expanded at once (set tracked in a `Set<string>`). Per the
  earlier Reveal-vs-tall-content audit, the **expanded panel must not be wrapped in `<Reveal/>`** —
  use AnimatePresence directly.
- **Catalyst Window convention** — `Catalyst Window (days)` is interpreted as "days until the
  catalyst fires, from today" (the badge renders `T−{n}d`), not "width of the window." Resolution
  of the `Primary Catalyst` relation to a human-readable name is **deferred** (`primaryCatalyst`
  stays null in the mapper today); the countdown alone carries the value. Wire title resolution
  later via a one-shot Catalysts DB query in `getEvidenceData`.
- **Funding currency** — `formatFundingCompact()` in `evidence/utils.ts` renders all funding as €
  regardless of the Notion field name (`Total Funding USD`). Enter the underlying value in
  whichever currency you want displayed; no FX conversion happens.
- **Founders shape** — `Founders` is a single `rich_text` block, one founder per line. Tier 1
  doesn't model per-founder data; `Founder Highlights` is a *company-level* multi-select. If
  you need per-founder structure later, add a separate Founders DB with a relation.
- **`oneOf()` helper** — `src/lib/notion.ts` exposes a typed narrower for select-name → literal
  union. Used for every new enum field. Renaming a Notion option silently falls back to null
  instead of crashing the mapper; intentional.

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
- **Dark surfaces are local-only.** Hero + Velocity wrap their content in a `.surface-deep`
  utility (defined in `globals.css`). Tokens used inside that wrapper are the `--color-*-on-deep`
  set; outside it stays light. Avoid mixing token families within a single component — both Hero
  and Velocity render their own header/footer hairlines from `--color-rule-on-deep`, not
  `--color-rule`.
- **`Adjusted SSI` is a Notion formula** (Raw SSI × `Source confidence` multiplier), read via the
  `formulaNumber()` helper in `notion.ts`. It is null whenever Raw SSI is null. UI helpers fall
  back to raw SSI for display when adjusted is missing — only render `—` when both are null.
- **Priority bands run off Adjusted SSI**, not raw. `getPriorityBand(adjusted)` in `ssi.ts`:
  P0 ≥80, P1 65–79, P2 50–64, P3 35–49, anything below is unbanded.
- **ISO week labels emit `W##-YYYY`** (not `YYYY-W##`) in `isoWeekLabel()` so the chart x-axis
  matches the Notion `Week` text field exactly.
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
- **Hooks auto-run.** `.claude/settings.json` runs `npm run type-check` on every `.ts`/`.tsx`
  edit (PostToolUse) and blocks writes to `.env.local` with exit 2 (PreToolUse). Don't re-run
  type-check manually after edits; edit `.env.example` instead of `.env.local` when changing
  env shape.
- **ESLint is a native flat config.** `eslint.config.mjs` imports `@next/eslint-plugin-next`'s
  `flatConfig.coreWebVitals` directly — NOT the `eslint-config-next` shareable config. The
  shareable config routes through `@rushstack/eslint-patch`, which fails to patch ESLint 9.39+
  on Node 24 (`Failed to patch ESLint because the calling module was not recognized`) and
  silently kills linting in both `eslint` and the `next build` lint step. Don't reintroduce
  `extends("next/core-web-vitals")` / `FlatCompat`. The plugin + `@typescript-eslint/parser` +
  `@eslint/js` resolve at the repo root via pnpm's default `public-hoist-pattern` (`*eslint*`).
  `next lint` is deprecated (removed in Next 16); the `lint` script is plain `eslint .`.
- **Vercel CLI 50.x `env add` quirks.** `vercel env add <name> <env>` takes **one** environment
  per call (not multi-env). Preview scope needs a git-branch positional — stdin pipe alone
  triggers an unsatisfiable interactive prompt. `--sensitive` + `development` scope also
  rejects stdin. For bulk adds, loop per-env and reserve `--sensitive` for production; pipe
  values with `printf '%s'` (not `echo` — avoids trailing newline in stored tokens).

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
├── sections/                 # Server Components (one per wireframe screen)
│   ├── Hero.tsx              # dark surface · 4-metric grid + 2 thesis mini-cards + latest signal
│   ├── Pipeline.tsx          # light · 4 stats + funnel + SSI histogram + quality gates
│   ├── Thesis.tsx            # light · 2 thesis cards with evidence bullets + company chips
│   ├── SignalVelocity.tsx    # dark · 12-week area chart + signal-type bars + this-week pulse
│   ├── Evidence.tsx          # light · Harmonic-shaped table (renders evidence/EvidenceTable)
│   └── Writing.tsx           # light · Substack posts (only section using <SectionHeader/>)
├── components/               # Mostly Server Components; chart + evidence/ are client
│   └── evidence/             # Table family — see "Evidence table" section above
├── lib/
│   ├── notion.ts             # All Notion queries — one fn per section + mappers
│   ├── ssi.ts                # Priority + heat helpers, formatters, 100-scale histogram
│   ├── thesis-canon.ts       # Canonical thesis names + structural defaults + regulatory catalysts
│   ├── types.ts              # Shared domain types
│   └── env.ts                # Typed env · fail-fast on missing vars
└── env.ts                    # (legacy location — see src/env.ts)
```

## Workflow

- **Feature work** — branch `feat/<scope>`, commit `feat(<scope>): ...`. Never commit to `main`.
- **Before every commit** — `npm run type-check` must be clean.
- **Before every commit** — update this CLAUDE.md if the session introduced anything future
  Claude should know (new gotcha, schema, tool, convention). The doc update lands in the same
  commit as the change it describes.
- **Before every deploy** — see `.claude/rules/quality.md` checklist (Lighthouse ≥90 across Perf /
  A11y / Best Practices, responsive at 375/768/1440, error boundaries verified by killing
  `NOTION_TOKEN` locally).
- **Subagents** — `deploy-gate-runner` runs the full `quality.md` checklist and returns
  pass/fail; invoke via `/deploy-gate` (or natural language) before `vercel deploy --prod`.
  `notion-schema-verifier` diffs live Notion schemas against `src/lib/types.ts` + the
  canonical names in `src/lib/thesis-canon.ts`; invoke when property names are suspected to
  have drifted.
- **`.claude/` visibility** — `.gitignore` whitelists `rules/`, `settings.json`, `agents/`, and
  `commands/` as team-shared; `settings.local.json` and `skills/` stay local. New files under
  `.claude/` need a conscious pick between the two (update `.gitignore` if adding a new shared
  surface).
- **Adding a new Notion DB** — (1) retrieve it via MCP / API, (2) store the data-source UUID (not
  the DB ID) in `.env.local` + `.env.example`, (3) add the key to `required` in `src/env.ts`, (4)
  write the fetcher in `src/lib/notion.ts` with a typed empty-state fallback.
