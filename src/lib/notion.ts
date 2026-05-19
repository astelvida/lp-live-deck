import { Client, isFullPage } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client";
import { env } from "@/env";
import {
  getHeatTier,
  getPriorityBand,
  histogramBuckets100,
} from "./ssi";
import {
  THESIS_CANON,
  THESIS_COMPANY_MATCHERS,
  THESIS_KEYS,
  THESIS_SIGNAL_MATCHERS,
  type ThesisCanonical,
  type ThesisKey,
} from "./thesis-canon";
import type {
  AntiThesisStatus,
  BlogPost,
  DiscoverySourceBar,
  EvidenceCompany,
  EvidenceData,
  EvidenceQuality,
  FalsifierStatus,
  FunnelStage,
  HeroData,
  HeroLatestSignal,
  HeroThesisMini,
  ICMemoStatus,
  Novelty,
  PipelineCompany,
  PipelineData,
  PipelineStatus,
  Priority,
  QualityGates,
  SignalRecord,
  SignalStrength,
  SignalTier,
  SignalType,
  SignalVelocityData,
  SourceConfidence,
  SSIBand,
  Thesis,
  ThesisCompany,
  ThesisEvidenceBullet,
  ThisWeekPulse,
  VelocityWeek,
} from "./types";

type QueryArgs = Parameters<Client["dataSources"]["query"]>[0];

function getEnv() {
  return env.get();
}

let cachedClient: Client | null = null;
function getClient(): Client {
  if (cachedClient) return cachedClient;
  const { NOTION_TOKEN } = getEnv();
  cachedClient = new Client({ auth: NOTION_TOKEN });
  return cachedClient;
}

type Props = PageObjectResponse["properties"];

function title(p: Props[string] | undefined): string | null {
  if (!p || p.type !== "title") return null;
  return p.title.map((t) => t.plain_text).join("") || null;
}

function richText(p: Props[string] | undefined): string | null {
  if (!p || p.type !== "rich_text") return null;
  return p.rich_text.map((t) => t.plain_text).join("") || null;
}

function num(p: Props[string] | undefined): number | null {
  if (!p || p.type !== "number") return null;
  return p.number;
}

function selectName(p: Props[string] | undefined): string | null {
  if (!p) return null;
  if (p.type === "select") return p.select?.name ?? null;
  if (p.type === "status") return p.status?.name ?? null;
  return null;
}

function multiSelectNames(p: Props[string] | undefined): string[] {
  if (!p || p.type !== "multi_select") return [];
  return p.multi_select.map((o) => o.name);
}

function dateStart(p: Props[string] | undefined): string | null {
  if (!p || p.type !== "date") return null;
  return p.date?.start ?? null;
}

function urlOf(p: Props[string] | undefined): string | null {
  if (!p || p.type !== "url") return null;
  return p.url;
}

function checkbox(p: Props[string] | undefined): boolean {
  if (!p || p.type !== "checkbox") return false;
  return p.checkbox;
}

function rollupNumber(p: Props[string] | undefined): number | null {
  if (!p || p.type !== "rollup") return null;
  if (p.rollup.type === "number") return p.rollup.number;
  if (p.rollup.type === "array") {
    let sum = 0;
    let found = false;
    for (const item of p.rollup.array) {
      if (item.type === "number" && item.number !== null) {
        sum += item.number;
        found = true;
      }
    }
    return found ? sum : null;
  }
  return null;
}

function rollupDate(p: Props[string] | undefined): string | null {
  if (!p || p.type !== "rollup") return null;
  if (p.rollup.type === "date") return p.rollup.date?.start ?? null;
  if (p.rollup.type === "array") {
    let latest: string | null = null;
    for (const item of p.rollup.array) {
      if (item.type === "date" && item.date?.start) {
        if (!latest || item.date.start > latest) latest = item.date.start;
      }
    }
    return latest;
  }
  return null;
}

function formulaString(p: Props[string] | undefined): string | null {
  if (!p || p.type !== "formula") return null;
  if (p.formula.type === "string") return p.formula.string;
  if (p.formula.type === "number") {
    return p.formula.number !== null ? String(p.formula.number) : null;
  }
  return null;
}

function formulaNumber(p: Props[string] | undefined): number | null {
  if (!p || p.type !== "formula") return null;
  if (p.formula.type === "number") return p.formula.number;
  if (p.formula.type === "string") {
    const n = Number(p.formula.string);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function relationFirstId(p: Props[string] | undefined): string | null {
  if (!p || p.type !== "relation") return null;
  return p.relation[0]?.id ?? null;
}

// Narrow an arbitrary string into a known literal union. Returns null when the
// value isn't in `allowed` — keeps the mapper resilient to Notion schema drift
// (a renamed option silently becomes null instead of a runtime crash).
function oneOf<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | null {
  if (!value) return null;
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

async function queryAll(args: QueryArgs): Promise<PageObjectResponse[]> {
  const client = getClient();
  const out: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;
  for (let i = 0; i < 20; i++) {
    const res = await client.dataSources.query({
      ...args,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const page of res.results) {
      if (isFullPage(page)) out.push(page);
    }
    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }
  return out;
}

// ---- Mappers ----

function parsePriority(raw: string | null): Priority | null {
  if (!raw) return null;
  if (raw.startsWith("P0")) return "P0";
  if (raw.startsWith("P1")) return "P1";
  if (raw.startsWith("P2")) return "P2";
  if (raw.startsWith("P3")) return "P3";
  return null;
}

function parseSignalTier(raw: string | null): SignalTier | null {
  if (!raw) return null;
  if (raw.includes("Highest")) return "Highest Conviction";
  if (raw.includes("Strong")) return "Strong";
  if (raw.includes("Emerging")) return "Emerging";
  if (raw.includes("Watchlist")) return "Watchlist";
  return null;
}

function parseStatus(raw: string | null): PipelineStatus | null {
  if (!raw) return null;
  if (raw.includes("Research")) return "Research";
  if (raw.includes("Scored")) return "Scored";
  if (raw.includes("Outreach")) return "Outreach";
  if (raw.includes("Call")) return "Call Scheduled";
  if (raw.includes("Memo")) return "Memo Written";
  if (raw.includes("Paused")) return "Paused";
  if (raw.includes("Pass")) return "Pass";
  if (raw.includes("Archived")) return "Archived";
  return null;
}

function parseFalsifier(raw: string | null): FalsifierStatus | null {
  if (!raw) return null;
  if (raw.includes("Clean")) return "Clean";
  if (raw.includes("Triggered")) return "Triggered";
  if (raw.includes("Not Run")) return "Not Run";
  return null;
}

function parseAntiThesis(raw: string | null): AntiThesisStatus | null {
  if (!raw) return null;
  if (raw === "Clear") return "Clear";
  if (raw === "1 Flag") return "1 Flag";
  if (raw === "Auto-pass") return "Auto-pass";
  if (raw === "Not Run") return "Not Run";
  return null;
}

function parseICMemo(raw: string | null): ICMemoStatus | null {
  if (!raw) return null;
  if (raw === "Not Started") return "Not Started";
  if (raw === "Draft") return "Draft";
  if (raw === "In Review") return "In Review";
  if (raw === "Approved") return "Approved";
  if (raw === "Passed") return "Passed";
  return null;
}

function parseSourceConfidence(raw: string | null): SourceConfidence | null {
  if (!raw) return null;
  if (raw === "High") return "High";
  if (raw === "Medium") return "Medium";
  if (raw === "Low") return "Low";
  return null;
}

// Notion option vocabularies for v3 enum fields — kept here next to the mapper
// so option drift is caught in one place. Anything outside these lists falls
// through to null via oneOf().
const RAISING_LIKELIHOOD_OPTS = ["Low", "Medium", "High", "Active"] as const;
const NEXT_ACTION_OPTS = [
  "Research",
  "Reach Out",
  "Draft Memo",
  "Track",
  "Pass",
] as const;
const STACK_RE_VECTOR_OPTS = ["Customer", "Competitor", "Tech partner"] as const;
const CUSTOMER_TYPE_OPTS = [
  "B2B",
  "B2C",
  "B2G",
  "B2B+B2C",
  "B2B+B2G",
] as const;
const OWNERSHIP_OPTS = [
  "Private",
  "Public",
  "Acquired",
  "Dead/Defunct",
  "Stealth",
] as const;
const WEB_TRAFFIC_TREND_OPTS = ["Up", "Flat", "Down", "N/A"] as const;

// `catalystMap` is an optional id→title lookup for Primary Catalyst relations.
// Callers that don't need the resolved name pass undefined; the field is null.
// Today only getEvidenceData populates the map (one extra Notion fetch per ISR
// rebuild); other fetchers leave it undefined to save the round-trip.
function mapCompany(
  page: PageObjectResponse,
  catalystMap?: Map<string, string>,
): PipelineCompany {
  const p = page.properties;
  const ssi = num(p["SSI Score"]);
  const catalystId = relationFirstId(p["Primary Catalyst"]);
  return {
    id: page.id,
    name: title(p["Company"]) ?? "Untitled",
    ssiScore: ssi,
    adjustedSsi: formulaNumber(p["Adjusted SSI"]),
    heatTier: getHeatTier(ssi),
    signalTier: parseSignalTier(selectName(p["Signal Tier"])),
    priority: parsePriority(selectName(p["Priority"])),
    status: parseStatus(selectName(p["Status"])),
    stage: selectName(p["Stage"]),
    sector: selectName(p["Sector"]),
    theses: multiSelectNames(p["Thesis"]),
    oneLiner: richText(p["One-liner"]),
    hq: richText(p["HQ"]),
    website: urlOf(p["Website"]),
    signalCount: rollupNumber(p["Signal Count"]) ?? 0,
    regulatoryEmbeddedness: num(p["Regulatory Embeddedness"]),
    keySignal30d: richText(p["Key Signal 30d"]),
    lastSignalDate: rollupDate(p["Last Signal Date"]),
    lastEditedAt: page.last_edited_time,
    sourceConfidence: parseSourceConfidence(selectName(p["Source confidence"])),
    falsifierCheck: parseFalsifier(selectName(p["Falsifier Check"])),
    antiThesisFilter: parseAntiThesis(selectName(p["Anti-thesis Filter"])),
    icMemoStatus: parseICMemo(selectName(p["IC Memo Status"])),
    discoverySource: selectName(p["Discovery Source"]),
    headcount: num(p["Headcount"]),
    founded: num(p["Founded"]),
    lastRaise: richText(p["Last Raise"]),
    lastScored: dateStart(p["Last Scored"]),
    // ---- v3: already in Notion, newly read ----
    linkedinUrl: urlOf(p["LinkedIn URL"]),
    raisingLikelihood: oneOf(
      selectName(p["Raising Likelihood"]),
      RAISING_LIKELIHOOD_OPTS,
    ),
    nextAction: oneOf(selectName(p["Next Action"]), NEXT_ACTION_OPTS),
    idleDays: formulaNumber(p["Idle Days"]),
    catalystWindowDays: num(p["Catalyst Window (days)"]),
    primaryCatalyst:
      catalystId && catalystMap ? (catalystMap.get(catalystId) ?? null) : null,
    stackREVector: oneOf(
      selectName(p["Stack RE Vector"]),
      STACK_RE_VECTOR_OPTS,
    ),
    passReason: selectName(p["Pass Reason"]),
    lastVerified: dateStart(p["Last verified"]),
    // ---- v3: Harmonic Tier 1 (manual entry in Notion) ----
    founders: richText(p["Founders"]),
    founderHighlights: multiSelectNames(p["Founder Highlights"]),
    customerType: oneOf(selectName(p["Customer Type"]), CUSTOMER_TYPE_OPTS),
    totalFundingUsd: num(p["Total Funding USD"]),
    lastRoundAmountUsd: num(p["Last Round Amount USD"]),
    lastRoundDate: dateStart(p["Last Round Date"]),
    notableInvestors: multiSelectNames(p["Notable Investors"]),
    ownership: oneOf(selectName(p["Ownership"]), OWNERSHIP_OPTS),
    founderLinkedin: urlOf(p["Founder LinkedIn"]),
    // ---- v3: Harmonic Tier 2 (traction/momentum, empty until enriched) ----
    headcount90dDeltaPct: num(p["Headcount 90d Δ %"]),
    linkedinFollowers: num(p["LinkedIn Followers"]),
    linkedinFollowers90dDeltaPct: num(p["LinkedIn Followers 90d Δ %"]),
    githubStars: num(p["GitHub Stars"]),
    webTrafficTrend: oneOf(
      selectName(p["Web Traffic Trend"]),
      WEB_TRAFFIC_TREND_OPTS,
    ),
  };
}

function parseNovelty(raw: string | null): Novelty | null {
  if (raw === "New") return "New";
  if (raw === "Repeated") return "Repeated";
  if (raw === "Escalating") return "Escalating";
  return null;
}

function parseEvidenceQuality(raw: string | null): EvidenceQuality | null {
  if (raw === "Primary") return "Primary";
  if (raw === "Secondary") return "Secondary";
  if (raw === "Tertiary") return "Tertiary";
  return null;
}

function mapSignal(page: PageObjectResponse): SignalRecord {
  const p = page.properties;
  const relationCompanyTitle = (() => {
    const rel = p["Pipeline Company"];
    if (!rel || rel.type !== "relation") return null;
    return null; // resolved by company-name join elsewhere if needed
  })();
  return {
    id: page.id,
    title: title(p["Signal"]) ?? "Untitled",
    detail: richText(p["Detail"]),
    dateDetected: dateStart(p["Date Detected"]) ?? page.created_time,
    week: richText(p["Week"]),
    signalType: (selectName(p["Signal Type"]) as SignalType) ?? null,
    strength: (selectName(p["Signal Strength"]) as SignalStrength) ?? null,
    thesisRelevance: multiSelectNames(p["Thesis Relevance"]),
    sourceChannel: selectName(p["Source Channel"]),
    company: relationCompanyTitle,
    novelty: parseNovelty(selectName(p["Novelty"])),
    evidenceQuality: parseEvidenceQuality(selectName(p["Evidence Quality"])),
    evidenceSourceType: selectName(p["Evidence Source Type"]),
    memoCandidate: checkbox(p["Memo Candidate"]),
    disqualifying: checkbox(p["Disqualifying"]),
    verified: checkbox(p["Verified"]),
    sourceUrl: urlOf(p["Source URL"]),
    actionTaken: selectName(p["Action Taken"]),
  };
}

// ---- Block helpers (for Thesis Pack parser) ----

async function listChildren(blockId: string): Promise<BlockObjectResponse[]> {
  const client = getClient();
  const out: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;
  for (let i = 0; i < 10; i++) {
    const res = await client.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const b of res.results) {
      if ("type" in b) out.push(b as BlockObjectResponse);
    }
    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }
  return out;
}

type RT = { plain_text: string; annotations?: { bold?: boolean } };
function joinRT(rts: RT[] | undefined): string {
  return (rts ?? []).map((t) => t.plain_text).join("");
}

function getBlockText(b: BlockObjectResponse): string {
  switch (b.type) {
    case "paragraph":
      return joinRT(b.paragraph.rich_text);
    case "heading_1":
      return joinRT(b.heading_1.rich_text);
    case "heading_2":
      return joinRT(b.heading_2.rich_text);
    case "heading_3":
      return joinRT(b.heading_3.rich_text);
    case "bulleted_list_item":
      return joinRT(b.bulleted_list_item.rich_text);
    case "numbered_list_item":
      return joinRT(b.numbered_list_item.rich_text);
    case "quote":
      return joinRT(b.quote.rich_text);
    case "callout":
      return joinRT(b.callout.rich_text);
    default:
      return "";
  }
}

// Walk the new Pack page: find heading_1 blocks for each thesis, then collect
// nearby paragraph/list blocks to pull out Core Bet / Anti-thesis / Sub-Segments.
// Falls back silently to THESIS_CANON when blocks are missing or restructured.
async function parseThesisPackBlocks(): Promise<
  Partial<Record<ThesisKey, Partial<ThesisCanonical>>>
> {
  const { NOTION_THESIS_PACK_PAGE } = getEnv();
  const top = await listChildren(NOTION_THESIS_PACK_PAGE);

  const out: Partial<Record<ThesisKey, Partial<ThesisCanonical>>> = {};

  // Walk top-level blocks; when we hit a heading_1 matching a thesis, slurp
  // subsequent siblings until the next heading_1.
  let currentKey: ThesisKey | null = null;
  let buffer: BlockObjectResponse[] = [];

  const flush = async () => {
    if (!currentKey) return;
    const slot: Partial<ThesisCanonical> = {};
    const subSegments: string[] = [];
    for (const block of buffer) {
      const text = getBlockText(block).trim();
      if (!text) continue;
      if (block.type === "heading_2" || block.type === "heading_3") {
        // section header inside a thesis — skip
        continue;
      }
      if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
        subSegments.push(text);
        continue;
      }
      const lower = text.toLowerCase();
      if (lower.startsWith("core bet:")) {
        slot.coreBet = text.replace(/^core bet:\s*/i, "").trim();
      } else if (lower.startsWith("anti-thesis:")) {
        slot.antiThesis = text.replace(/^anti-thesis:\s*/i, "").trim();
      } else if (lower.startsWith("what we underwrite:")) {
        slot.whatWeUnderwrite = text
          .replace(/^what we underwrite:\s*/i, "")
          .trim();
      }
    }
    if (subSegments.length > 0) slot.subSegments = subSegments;
    out[currentKey] = slot;
  };

  for (const block of top) {
    if (block.type === "heading_1") {
      // close previous
      await flush();
      buffer = [];
      const text = getBlockText(block).toLowerCase();
      currentKey = null;
      if (text.includes("governed agentic ops")) currentKey = "Governed Agentic Ops";
      else if (
        text.includes("vertical sor") ||
        text.includes("vertical system-of-record") ||
        text.includes("vsrai")
      )
        currentKey = "Vertical SoR AI";
      continue;
    }
    if (currentKey) buffer.push(block);
  }
  await flush();

  return out;
}

// ---- Top-level fetchers ----

async function allCompanies(
  catalystMap?: Map<string, string>,
): Promise<PipelineCompany[]> {
  const { NOTION_DEALFLOW_DB } = getEnv();
  const pages = await queryAll({ data_source_id: NOTION_DEALFLOW_DB });
  return pages.map((page) => mapCompany(page, catalystMap));
}

async function allSignals(): Promise<SignalRecord[]> {
  const { NOTION_SIGNAL_DB } = getEnv();
  const pages = await queryAll({
    data_source_id: NOTION_SIGNAL_DB,
    sorts: [{ property: "Date Detected", direction: "descending" }],
  });
  return pages.map(mapSignal);
}

async function allPosts(): Promise<BlogPost[]> {
  const { NOTION_BLOG_DB } = getEnv();
  const pages = await queryAll({
    data_source_id: NOTION_BLOG_DB,
    sorts: [{ property: "Published Date", direction: "descending" }],
  });
  return pages.map(mapBlog);
}

function mapBlog(page: PageObjectResponse): BlogPost {
  const p = page.properties;
  return {
    id: page.id,
    title: title(p["Title"]) ?? "Untitled Post",
    slug: richText(p["Slug"]),
    canonicalUrl: urlOf(p["Canonical URL"]),
    excerpt: richText(p["Excerpt"]),
    publishedDate: dateStart(p["Published Date"]),
    readingTime: formulaString(p["Reading Time"]),
    tags: multiSelectNames(p["Tags"]),
    format: selectName(p["Format"]),
    angle: selectName(p["Angle"]),
    relatedThesis: multiSelectNames(p["Related Thesis"]),
    featured: checkbox(p["Featured"]),
  };
}

function isActive(c: PipelineCompany): boolean {
  return c.status !== "Pass" && c.status !== "Archived";
}

function avg(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// ISO week label `W##-YYYY` (matches the Notion `Week` text field).
function isoWeekLabel(date: Date): { key: string; start: string } {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  const key = `W${String(weekNo).padStart(2, "0")}-${d.getUTCFullYear()}`;
  const monday = new Date(date);
  const day = monday.getUTCDay() || 7;
  monday.setUTCDate(monday.getUTCDate() - day + 1);
  return { key, start: monday.toISOString().slice(0, 10) };
}

// ---- Hero ----

export async function getHeroData(): Promise<HeroData> {
  try {
    const [companies, signals] = await Promise.all([
      allCompanies(),
      allSignals(),
    ]);
    const active = companies.filter(isActive);
    const adjusted = active
      .map((c) => c.adjustedSsi ?? c.ssiScore)
      .filter((n): n is number => typeof n === "number");

    const p0p1 = active.filter(
      (c) => c.priority === "P0" || c.priority === "P1",
    );

    const memoReady = active.filter((c) => c.icMemoStatus === "Approved").length;
    const outreachActive = active.filter(
      (c) =>
        c.status === "Outreach" ||
        c.status === "Call Scheduled" ||
        c.status === "Memo Written",
    ).length;
    const escalatingSignals = signals.filter(
      (s) => s.novelty === "Escalating",
    ).length;

    const theses: HeroThesisMini[] = THESIS_KEYS.map((key) => {
      const canon = THESIS_CANON[key];
      const matchers = THESIS_COMPANY_MATCHERS[key];
      const matching = active.filter((c) =>
        c.theses.some((t) => matchers.includes(t)),
      );
      const fit = matching.filter(
        (c) => c.priority === "P0" || c.priority === "P1",
      );
      return {
        key,
        number: canon.number,
        title: canon.title,
        shortDescription: canon.coreBet,
        regulatoryPills: canon.regulatoryPills,
        companyCount: matching.length,
        thesisFitCount: fit.length,
      };
    });

    const latestStrong = signals.find(
      (s) => s.strength === "Strong" && s.novelty === "Escalating",
    );
    const latestSignal: HeroLatestSignal | null = latestStrong
      ? {
          title: latestStrong.title,
          company: latestStrong.company,
          week: latestStrong.week,
          sourceChannel: latestStrong.sourceChannel,
          strength: latestStrong.strength,
          novelty: latestStrong.novelty,
        }
      : null;

    return {
      companiesTracked: active.length,
      signalsLogged: signals.length,
      avgAdjustedSsi: avg(adjusted),
      p0p1Count: p0p1.length,
      memoReady,
      outreachActive,
      escalatingSignals,
      theses,
      latestSignal,
      generatedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error("[getHeroData]", e);
    return {
      companiesTracked: 0,
      signalsLogged: 0,
      avgAdjustedSsi: null,
      p0p1Count: 0,
      memoReady: 0,
      outreachActive: 0,
      escalatingSignals: 0,
      theses: THESIS_KEYS.map((key) => {
        const canon = THESIS_CANON[key];
        return {
          key,
          number: canon.number,
          title: canon.title,
          shortDescription: canon.coreBet,
          regulatoryPills: canon.regulatoryPills,
          companyCount: 0,
          thesisFitCount: 0,
        };
      }),
      latestSignal: null,
      generatedAt: new Date().toISOString(),
    };
  }
}

// ---- Theses ----

export async function getTheses(): Promise<Thesis[]> {
  try {
    const [packOverlay, companies, signals] = await Promise.all([
      parseThesisPackBlocks().catch(() => ({}) as ReturnType<
        typeof parseThesisPackBlocks
      > extends Promise<infer R>
        ? R
        : never),
      allCompanies(),
      allSignals(),
    ]);
    const now = Date.now();
    const NINETY = 90 * 24 * 60 * 60 * 1000;
    const THIRTY = 30 * 24 * 60 * 60 * 1000;

    return THESIS_KEYS.map((key) => {
      const canon = THESIS_CANON[key];
      const overlay = (packOverlay as Partial<
        Record<ThesisKey, Partial<ThesisCanonical>>
      >)?.[key];

      const companyMatchers = THESIS_COMPANY_MATCHERS[key];
      const matchingCompanies = companies.filter(
        (c) => isActive(c) && c.theses.some((t) => companyMatchers.includes(t)),
      );
      const topCompanies: ThesisCompany[] = matchingCompanies
        .slice()
        .sort(
          (a, b) =>
            (b.adjustedSsi ?? b.ssiScore ?? 0) -
            (a.adjustedSsi ?? a.ssiScore ?? 0),
        )
        .slice(0, 6)
        .map((c) => ({
          id: c.id,
          name: c.name,
          ssiScore: c.ssiScore,
          adjustedSsi: c.adjustedSsi,
          priority: c.priority,
        }));

      const signalMatchers = THESIS_SIGNAL_MATCHERS[key];
      const thesisSignals = signals.filter((s) =>
        s.thesisRelevance.some((x) => signalMatchers.includes(x)),
      );
      const evidence: ThesisEvidenceBullet[] = thesisSignals
        .filter(
          (s) => s.strength === "Strong" || s.novelty === "Escalating",
        )
        .slice(0, 4)
        .map((s) => {
          const detectedMs = new Date(s.dateDetected).getTime();
          const isFresh =
            !Number.isNaN(detectedMs) && now - detectedMs <= THIRTY;
          return {
            id: s.id,
            title: s.title,
            detail: s.detail,
            week: s.week,
            sourceChannel: s.sourceChannel,
            signalType: s.signalType,
            novelty: s.novelty,
            isFresh,
          };
        });

      const strongSignals90d = thesisSignals.filter((s) => {
        if (s.strength !== "Strong") return false;
        const d = new Date(s.dateDetected).getTime();
        if (Number.isNaN(d)) return false;
        return now - d <= NINETY;
      }).length;

      return {
        key,
        number: canon.number,
        title: canon.title,
        shortTitle: canon.shortTitle,
        coreBet: overlay?.coreBet ?? canon.coreBet,
        antiThesis: overlay?.antiThesis ?? canon.antiThesis,
        subSegments:
          overlay?.subSegments && overlay.subSegments.length > 0
            ? overlay.subSegments
            : canon.subSegments,
        regulatoryPills: canon.regulatoryPills,
        companies: topCompanies,
        totalCompanies: matchingCompanies.length,
        thesisFitCount: matchingCompanies.filter(
          (c) => c.priority === "P0" || c.priority === "P1",
        ).length,
        evidence,
        strongSignals90d,
      };
    });
  } catch (e) {
    console.error("[getTheses]", e);
    return THESIS_KEYS.map((key) => {
      const canon = THESIS_CANON[key];
      return {
        key,
        number: canon.number,
        title: canon.title,
        shortTitle: canon.shortTitle,
        coreBet: canon.coreBet,
        antiThesis: canon.antiThesis,
        subSegments: canon.subSegments,
        regulatoryPills: canon.regulatoryPills,
        companies: [],
        totalCompanies: 0,
        thesisFitCount: 0,
        evidence: [],
        strongSignals90d: 0,
      };
    });
  }
}

// ---- Pipeline ----

export async function getPipeline(): Promise<PipelineData> {
  try {
    const companies = await allCompanies();
    const active = companies.filter(isActive);

    const adjustedScores = active
      .map((c) => c.adjustedSsi ?? c.ssiScore)
      .filter((n): n is number => typeof n === "number");

    const fundingStageOrder = [
      "Pre-Seed",
      "Seed",
      "Series A",
      "Series B",
      "Growth",
    ];
    const fundingStages = fundingStageOrder.map((stage) => ({
      stage,
      count: active.filter((c) => c.stage === stage).length,
    }));

    const funnelOrder: Array<{ key: FunnelStage["key"]; icon: string }> = [
      { key: "Research", icon: "🔍" },
      { key: "Scored", icon: "📊" },
      { key: "Outreach", icon: "📧" },
      { key: "Call Scheduled", icon: "☎" },
      { key: "Memo Written", icon: "📝" },
    ];
    const total = active.length || 1;
    const funnel: FunnelStage[] = funnelOrder.map(({ key, icon }) => {
      const count = active.filter((c) => c.status === key).length;
      return {
        key,
        icon,
        label: key,
        count,
        pct: Math.round((count / total) * 100),
      };
    });

    const buckets = histogramBuckets100(adjustedScores);
    const totalScored = adjustedScores.length || 1;
    const ssiBandsMeta: Array<{
      key: SSIBand["key"];
      label: string;
      range: string;
      priorityNote: string;
    }> = [
      {
        key: "P0",
        label: "P0",
        range: "80–100",
        priorityNote: "← P0 Act Now",
      },
      {
        key: "P1",
        label: "P1",
        range: "65–79",
        priorityNote: "← P1 This Week",
      },
      {
        key: "P2",
        label: "P2",
        range: "50–64",
        priorityNote: "← P2 This Month",
      },
      {
        key: "P3-mid",
        label: "P3",
        range: "35–49",
        priorityNote: "",
      },
      {
        key: "P3-low",
        label: "—",
        range: "< 35",
        priorityNote: "← P3 Monitor",
      },
    ];
    const ssiBands: SSIBand[] = ssiBandsMeta.map((meta, i) => ({
      ...meta,
      count: buckets[i]?.count ?? 0,
      pct: Math.round(((buckets[i]?.count ?? 0) / totalScored) * 100),
    }));

    const discoveryMap = new Map<string, number>();
    for (const c of active) {
      if (!c.discoverySource) continue;
      discoveryMap.set(
        c.discoverySource,
        (discoveryMap.get(c.discoverySource) ?? 0) + 1,
      );
    }
    const discoverySources: DiscoverySourceBar[] = Array.from(
      discoveryMap.entries(),
    )
      .map(([key, count]) => ({ key, label: key, count }))
      .sort((a, b) => b.count - a.count);

    const qualityGates: QualityGates = {
      sourceConfidence: {
        high: active.filter((c) => c.sourceConfidence === "High").length,
        medium: active.filter((c) => c.sourceConfidence === "Medium").length,
        low: active.filter((c) => c.sourceConfidence === "Low").length,
        notSet: active.filter((c) => c.sourceConfidence === null).length,
      },
      falsifier: {
        clean: active.filter((c) => c.falsifierCheck === "Clean").length,
        triggered: active.filter((c) => c.falsifierCheck === "Triggered").length,
        notRun: active.filter(
          (c) => c.falsifierCheck === "Not Run" || c.falsifierCheck === null,
        ).length,
      },
      antiThesis: {
        clear: active.filter((c) => c.antiThesisFilter === "Clear").length,
        flagged: active.filter((c) => c.antiThesisFilter === "1 Flag").length,
        autoPass: active.filter((c) => c.antiThesisFilter === "Auto-pass").length,
        notRun: active.filter(
          (c) => c.antiThesisFilter === "Not Run" || c.antiThesisFilter === null,
        ).length,
      },
    };

    return {
      totalActive: active.length,
      p0p1Count: active.filter(
        (c) => c.priority === "P0" || c.priority === "P1",
      ).length,
      avgAdjustedSsi: avg(adjustedScores),
      icMemoApproved: active.filter((c) => c.icMemoStatus === "Approved").length,
      fundingStages,
      funnel,
      ssiBands,
      discoverySources,
      qualityGates,
    };
  } catch (e) {
    console.error("[getPipeline]", e);
    return {
      totalActive: 0,
      p0p1Count: 0,
      avgAdjustedSsi: null,
      icMemoApproved: 0,
      fundingStages: [],
      funnel: [],
      ssiBands: [],
      discoverySources: [],
      qualityGates: {
        sourceConfidence: { high: 0, medium: 0, low: 0, notSet: 0 },
        falsifier: { clean: 0, triggered: 0, notRun: 0 },
        antiThesis: { clear: 0, flagged: 0, autoPass: 0, notRun: 0 },
      },
    };
  }
}

// ---- Signal Velocity ----

export async function getSignalVelocity(
  weeks = 12,
): Promise<SignalVelocityData> {
  try {
    const signals = await allSignals();
    const now = new Date();
    const buckets = new Map<string, VelocityWeek>();
    for (let i = weeks - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i * 7);
      const { key, start } = isoWeekLabel(d);
      if (!buckets.has(key))
        buckets.set(key, { week: key, weekStart: start, total: 0, strong: 0 });
    }
    for (const s of signals) {
      const d = new Date(s.dateDetected);
      if (Number.isNaN(d.getTime())) continue;
      const { key, start } = isoWeekLabel(d);
      const existing = buckets.get(key);
      const b =
        existing ?? { week: key, weekStart: start, total: 0, strong: 0 };
      b.total += 1;
      if (s.strength === "Strong") b.strong += 1;
      if (!existing) buckets.set(key, b);
    }
    const sorted = Array.from(buckets.values())
      .sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1))
      .slice(-weeks);

    const twelveWeekAvg =
      sorted.length === 0
        ? 0
        : sorted.reduce((a, w) => a + w.total, 0) / sorted.length;

    const latest = sorted[sorted.length - 1];
    const latestKey = latest?.week ?? null;
    const thisWeekSignals = latestKey
      ? signals.filter((s) => {
          const d = new Date(s.dateDetected);
          if (Number.isNaN(d.getTime())) return false;
          return isoWeekLabel(d).key === latestKey;
        })
      : [];
    const thisWeek: ThisWeekPulse = {
      total: thisWeekSignals.length,
      strong: thisWeekSignals.filter((s) => s.strength === "Strong").length,
      escalating: thisWeekSignals.filter((s) => s.novelty === "Escalating")
        .length,
    };

    const typeCounts = new Map<SignalType, number>();
    for (const s of signals) {
      if (!s.signalType) continue;
      typeCounts.set(
        s.signalType,
        (typeCounts.get(s.signalType) ?? 0) + 1,
      );
    }
    const sortedTypes = Array.from(typeCounts.entries()).sort(
      (a, b) => b[1] - a[1],
    );
    const TOP_N = 7;
    const topSignalTypes = sortedTypes
      .slice(0, TOP_N)
      .map(([type, count]) => ({ type, count }));
    const otherSignalCount = sortedTypes
      .slice(TOP_N)
      .reduce((a, [, c]) => a + c, 0);

    const noveltyBreakdown = {
      new: signals.filter((s) => s.novelty === "New").length,
      repeated: signals.filter((s) => s.novelty === "Repeated").length,
      escalating: signals.filter((s) => s.novelty === "Escalating").length,
    };

    const evidenceQuality = {
      primary: signals.filter((s) => s.evidenceQuality === "Primary").length,
      secondary: signals.filter((s) => s.evidenceQuality === "Secondary").length,
      tertiary: signals.filter((s) => s.evidenceQuality === "Tertiary").length,
    };

    const byThesisRelevance = {
      "Governed Agentic Ops": signals.filter(
        (s) =>
          s.thesisRelevance.includes("Governed Agentic Ops") &&
          !s.thesisRelevance.includes("Vertical SoR AI"),
      ).length,
      "Vertical SoR AI": signals.filter(
        (s) =>
          s.thesisRelevance.includes("Vertical SoR AI") &&
          !s.thesisRelevance.includes("Governed Agentic Ops"),
      ).length,
      both: signals.filter(
        (s) =>
          s.thesisRelevance.includes("Governed Agentic Ops") &&
          s.thesisRelevance.includes("Vertical SoR AI"),
      ).length,
    };

    return {
      weeks: sorted,
      twelveWeekAvg,
      thisWeek,
      topSignalTypes,
      otherSignalCount,
      noveltyBreakdown,
      evidenceQuality,
      byThesisRelevance,
      disqualifying: signals.filter((s) => s.disqualifying).length,
      memoCandidates: signals.filter((s) => s.memoCandidate).length,
    };
  } catch (e) {
    console.error("[getSignalVelocity]", e);
    return {
      weeks: [],
      twelveWeekAvg: 0,
      thisWeek: { total: 0, strong: 0, escalating: 0 },
      topSignalTypes: [],
      otherSignalCount: 0,
      noveltyBreakdown: { new: 0, repeated: 0, escalating: 0 },
      evidenceQuality: { primary: 0, secondary: 0, tertiary: 0 },
      byThesisRelevance: {
        "Governed Agentic Ops": 0,
        "Vertical SoR AI": 0,
        both: 0,
      },
      disqualifying: 0,
      memoCandidates: 0,
    };
  }
}

// ---- Evidence ----

export async function getEvidenceData(): Promise<EvidenceData> {
  try {
    const [companies, signals] = await Promise.all([
      allCompanies(),
      allSignals(),
    ]);
    const active = companies.filter(isActive);

    // Build a name → recent-signals map. The Signals DB has a Pipeline Company
    // relation, but resolving it requires a second round-trip per signal;
    // mapping by company name (richText on signals, title on companies) covers
    // the rendering case for now.
    const byCompany = new Map<string, SignalRecord[]>();
    for (const s of signals) {
      const name = s.company;
      if (!name) continue;
      const arr = byCompany.get(name) ?? [];
      arr.push(s);
      byCompany.set(name, arr);
    }

    const enriched: EvidenceCompany[] = active.map((c) => {
      const recent = (byCompany.get(c.name) ?? []).slice(0, 5);
      const thesisBadge: ThesisKey | "Both" | null = c.theses.includes("Both")
        ? "Both"
        : c.theses.includes("Governed Agentic Ops")
          ? "Governed Agentic Ops"
          : c.theses.includes("Vertical SoR AI")
            ? "Vertical SoR AI"
            : null;
      return { ...c, thesisBadge, recentSignals: recent };
    });

    enriched.sort((a, b) => {
      const aScore = a.adjustedSsi ?? a.ssiScore ?? 0;
      const bScore = b.adjustedSsi ?? b.ssiScore ?? 0;
      return bScore - aScore;
    });

    return { companies: enriched };
  } catch (e) {
    console.error("[getEvidenceData]", e);
    return { companies: [] };
  }
}

// ---- Writing (unchanged) ----

export async function getLatestPosts(): Promise<{
  featured: BlogPost | null;
  recent: BlogPost[];
}> {
  try {
    const posts = await allPosts();
    const published = posts.filter((p) => p.publishedDate);
    const featured = published.find((p) => p.featured) ?? null;
    const recent = published
      .filter((p) => !featured || p.id !== featured.id)
      .slice(0, 3);
    return { featured, recent };
  } catch (e) {
    console.error("[getLatestPosts]", e);
    return { featured: null, recent: [] };
  }
}

// Re-export for the priority-band consumer in pipeline UI.
export { getPriorityBand };
