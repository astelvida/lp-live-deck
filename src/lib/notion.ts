import { Client, isFullPage } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client";
import { env } from "@/env";
import { getHeatTier, histogramBuckets } from "./ssi";
import type {
  BlogPost,
  FunnelData,
  FunnelStage,
  HeroStats,
  InfraCounts,
  PassReason,
  PipelineCompany,
  PipelineData,
  ScoutingChannelCount,
  ScoutingData,
  SignalRecord,
  SignalStrength,
  SignalType,
  SignalVelocityData,
  Thesis,
  VisualStyle,
  VelocityWeek,
  Priority,
  SignalTier,
  PipelineStatus,
  HeatTier,
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
    // sum numeric items
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

function mapCompany(page: PageObjectResponse): PipelineCompany {
  const p = page.properties;
  const ssi = num(p["SSI Score"]);
  const tier = getHeatTier(ssi);
  const priorityRaw = selectName(p["Priority"]);
  const priority: Priority | null = priorityRaw?.startsWith("P0")
    ? "P0"
    : priorityRaw?.startsWith("P1")
      ? "P1"
      : priorityRaw?.startsWith("P2")
        ? "P2"
        : priorityRaw?.startsWith("P3")
          ? "P3"
          : null;
  const sigTierRaw = selectName(p["Signal Tier"]);
  const signalTier: SignalTier | null = sigTierRaw?.includes("Highest")
    ? "Highest Conviction"
    : sigTierRaw?.includes("Strong")
      ? "Strong"
      : sigTierRaw?.includes("Emerging")
        ? "Emerging"
        : sigTierRaw?.includes("Watchlist")
          ? "Watchlist"
          : null;
  const statusRaw = selectName(p["Status"]);
  const status: PipelineStatus | null = statusRaw?.includes("Research")
    ? "Research"
    : statusRaw?.includes("Scored")
      ? "Scored"
      : statusRaw?.includes("Outreach")
        ? "Outreach"
        : statusRaw?.includes("Call")
          ? "Call Scheduled"
          : statusRaw?.includes("Memo")
            ? "Memo Written"
            : statusRaw?.includes("Paused")
              ? "Paused"
              : statusRaw?.includes("Pass")
                ? "Pass"
                : null;

  return {
    id: page.id,
    name: title(p["Company"]) ?? "Untitled",
    ssiScore: ssi,
    heatTier: tier,
    signalTier,
    priority,
    status,
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
  };
}

function mapSignal(page: PageObjectResponse): SignalRecord {
  const p = page.properties;
  const typeRaw = selectName(p["Signal Type"]);
  const strengthRaw = selectName(p["Signal Strength"]);
  return {
    id: page.id,
    title: title(p["Signal"]) ?? "Untitled",
    dateDetected: dateStart(p["Date Detected"]) ?? page.created_time,
    week: richText(p["Week"]),
    signalType: (typeRaw as SignalType) ?? null,
    strength: (strengthRaw as SignalStrength) ?? null,
    thesisRelevance: multiSelectNames(p["Thesis Relevance"]),
    sourceChannel: selectName(p["Source Channel"]),
    company: richText(p["Company"]),
  };
}

// ---- Theses: parsed from the Investment Thesis Pack page ----
// The page uses a column_list with 3 callouts (icon + color + rich_text) and 3 child_page blocks
// linking to the full thesis pages. We walk the block tree once per revalidation.

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

const COLOR_TO_STYLE: Record<string, VisualStyle> = {
  red_background: "Converging",
  red: "Converging",
  orange_background: "Expanding",
  orange: "Expanding",
  blue_background: "Fragmenting",
  blue: "Fragmenting",
  green_background: "Emerging",
  green: "Emerging",
  purple_background: "Emerging",
  yellow_background: "Emerging",
  default: "Emerging",
};

type RichText = { plain_text: string; annotations?: { bold?: boolean } };

function joinRichText(rts: RichText[] | undefined): string {
  if (!rts) return "";
  return rts.map((t) => t.plain_text).join("").trim();
}

function splitTitleHookFromRichText(rts: RichText[] | undefined): {
  title: string;
  hook: string;
} {
  if (!rts || rts.length === 0) return { title: "", hook: "" };
  const boldLeading: string[] = [];
  const rest: string[] = [];
  let stillLeading = true;
  for (const span of rts) {
    if (stillLeading && span.annotations?.bold) {
      boldLeading.push(span.plain_text);
    } else {
      stillLeading = false;
      rest.push(span.plain_text);
    }
  }
  const title = boldLeading.join("").trim();
  const hook = rest.join("").trim();
  if (title && hook) return { title, hook };
  // Fallback: split on first newline in the joined text
  const joined = joinRichText(rts);
  const nl = joined.indexOf("\n");
  if (nl !== -1) {
    return { title: joined.slice(0, nl).trim(), hook: joined.slice(nl + 1).trim() };
  }
  return { title: joined.slice(0, 80).trim(), hook: "" };
}

async function paragraphsText(blockId: string): Promise<string> {
  try {
    const children = await listChildren(blockId);
    const parts: string[] = [];
    for (const b of children) {
      if (b.type === "paragraph") parts.push(joinRichText(b.paragraph.rich_text));
      else if (b.type === "bulleted_list_item")
        parts.push("• " + joinRichText(b.bulleted_list_item.rich_text));
      else if (b.type === "numbered_list_item")
        parts.push(joinRichText(b.numbered_list_item.rich_text));
      else if (b.type === "quote") parts.push(joinRichText(b.quote.rich_text));
    }
    return parts.filter(Boolean).join(" ");
  } catch {
    return "";
  }
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

// --------- Section fetchers ---------

async function allCompanies(): Promise<PipelineCompany[]> {
  const { NOTION_DEALFLOW_DB } = getEnv();
  const pages = await queryAll({ data_source_id: NOTION_DEALFLOW_DB });
  return pages.map(mapCompany);
}

async function allSignals(): Promise<SignalRecord[]> {
  const { NOTION_SIGNAL_DB } = getEnv();
  const pages = await queryAll({
    data_source_id: NOTION_SIGNAL_DB,
    sorts: [{ property: "Date Detected", direction: "descending" }],
  });
  return pages.map(mapSignal);
}

async function extractTheses(): Promise<Thesis[]> {
  const { NOTION_THESIS_PACK_PAGE } = getEnv();

  // Pull top-level blocks of the Pack page, and find the child_page IDs + the column_list.
  const topBlocks = await listChildren(NOTION_THESIS_PACK_PAGE);

  const childPages = topBlocks.filter(
    (b): b is Extract<BlockObjectResponse, { type: "child_page" }> =>
      b.type === "child_page",
  );

  const columnListBlock = topBlocks.find(
    (b): b is Extract<BlockObjectResponse, { type: "column_list" }> =>
      b.type === "column_list",
  );

  // Walk the column_list: one callout per column.
  type Callout = {
    title: string;
    hook: string;
    icon: string | null;
    visualStyle: VisualStyle | null;
  };
  const callouts: Callout[] = [];
  if (columnListBlock) {
    const columns = await listChildren(columnListBlock.id);
    for (const col of columns) {
      if (col.type !== "column") continue;
      const colChildren = await listChildren(col.id);
      const callout = colChildren.find(
        (b): b is Extract<BlockObjectResponse, { type: "callout" }> =>
          b.type === "callout",
      );
      if (!callout) continue;
      const { title, hook: inlineHook } = splitTitleHookFromRichText(
        callout.callout.rich_text,
      );
      const childHook = callout.has_children ? await paragraphsText(callout.id) : "";
      const hook = [inlineHook, childHook].filter(Boolean).join(" ").trim();
      const icon =
        callout.callout.icon?.type === "emoji"
          ? callout.callout.icon.emoji
          : null;
      const colorKey = String(callout.callout.color ?? "default");
      const visualStyle = COLOR_TO_STYLE[colorKey] ?? "Emerging";
      callouts.push({ title, hook, icon, visualStyle });
    }
  }

  // Merge callouts with child_page titles, aligning by order and fuzzy title match.
  const theses: Thesis[] = childPages.map((cp, i) => {
    const childTitle = cp.child_page.title;
    const byIndex = callouts[i];
    const byMatch = callouts.find((c) =>
      c.title.toLowerCase().includes(childTitle.toLowerCase().slice(0, 14)),
    );
    const matched = byMatch ?? byIndex ?? null;
    return {
      id: cp.id,
      number: i + 1,
      title: childTitle,
      category: null,
      conviction: null,
      contrarianHook: matched?.hook ?? null,
      marketSize: null,
      investmentCriteria: null,
      keyRisks: null,
      regulatoryCatalystDate: null,
      visualStyle: matched?.visualStyle ?? null,
      companiesTracked: 0,
      slug: null,
      topCompanies: [],
      strongSignals90d: 0,
    };
  });

  return theses;
}

async function allPosts(): Promise<BlogPost[]> {
  const { NOTION_BLOG_DB } = getEnv();
  const pages = await queryAll({
    data_source_id: NOTION_BLOG_DB,
    sorts: [{ property: "Published Date", direction: "descending" }],
  });
  return pages.map(mapBlog);
}

function daysAgo(iso: string, now: number): number {
  const t = new Date(iso).getTime();
  return (now - t) / (1000 * 60 * 60 * 24);
}

export async function getHeroStats(): Promise<HeroStats> {
  try {
    const [companies, signals] = await Promise.all([allCompanies(), allSignals()]);
    const active = companies.filter((c) => c.status !== "Pass");
    const now = Date.now();
    const signals7d = signals.filter((s) => daysAgo(s.dateDetected, now) <= 7).length;
    const signals30d = signals.filter((s) => daysAgo(s.dateDetected, now) <= 30).length;
    const topPriorityCompanies = active
      .filter((c) => c.priority === "P0")
      .sort((a, b) => (b.ssiScore ?? 0) - (a.ssiScore ?? 0))
      .slice(0, 5)
      .map((c) => ({ name: c.name, ssiScore: c.ssiScore, sector: c.sector }));
    return {
      pipelineCount: active.length,
      signals7d,
      signals30d,
      totalSignals: signals.length,
      topPriorityCompanies,
      generatedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error("[getHeroStats]", e);
    return {
      pipelineCount: 0,
      signals7d: 0,
      signals30d: 0,
      totalSignals: 0,
      topPriorityCompanies: [],
      generatedAt: new Date().toISOString(),
    };
  }
}

// Thesis child-page titles in Notion don't exactly match the Dealflow/SignalLog
// multi-select enums. "Both" in Dealflow means a company fits Compliance + Vertical.
const THESIS_COMPANY_ALIASES: Record<string, string[]> = {
  "The Compliance AI Moat": ["Compliance AI Moat", "Both"],
  "Vertical AI in Regulated Industries": ["Vertical AI in Regulated Industries", "Both"],
  "AI Evaluation & Production Infrastructure": ["AI Eval & Testing Infrastructure"],
};
const THESIS_SIGNAL_ALIASES: Record<string, string[]> = {
  "The Compliance AI Moat": ["Compliance AI Moat"],
  "Vertical AI in Regulated Industries": ["Vertical AI in Regulated Industries"],
  "AI Evaluation & Production Infrastructure": ["AI Eval & Testing Infrastructure"],
};

export async function getTheses(): Promise<Thesis[]> {
  try {
    const [theses, companies, signals] = await Promise.all([
      extractTheses(),
      allCompanies(),
      allSignals(),
    ]);
    const now = Date.now();
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

    return theses.map((t) => {
      const companyKeys = THESIS_COMPANY_ALIASES[t.title] ?? [];
      const matching = companies.filter(
        (c) => c.status !== "Pass" && c.theses.some((x) => companyKeys.includes(x)),
      );
      const topCompanies = matching
        .filter((c): c is PipelineCompany & { ssiScore: number } => c.ssiScore !== null)
        .sort((a, b) => b.ssiScore - a.ssiScore)
        .slice(0, 3)
        .map((c) => ({
          id: c.id,
          name: c.name,
          ssiScore: c.ssiScore,
          priority: c.priority,
        }));

      const signalKeys = THESIS_SIGNAL_ALIASES[t.title] ?? [];
      const strongSignals90d = signals.filter((s) => {
        if (s.strength !== "Strong") return false;
        if (!s.thesisRelevance.some((x) => signalKeys.includes(x))) return false;
        const d = new Date(s.dateDetected).getTime();
        if (Number.isNaN(d)) return false;
        return now - d <= NINETY_DAYS_MS;
      }).length;

      return {
        ...t,
        companiesTracked: matching.length,
        topCompanies,
        strongSignals90d,
      };
    });
  } catch (e) {
    console.error("[getTheses]", e);
    return [];
  }
}

export async function getPipeline(): Promise<PipelineData> {
  try {
    const companies = await allCompanies();
    const scored = companies.filter((c) => c.ssiScore !== null && c.status !== "Pass");
    const byTier: Record<HeatTier, number> = { HOT: 0, WARM: 0, WATCH: 0, EARLY: 0 };
    for (const c of scored) {
      if (c.heatTier) byTier[c.heatTier] += 1;
    }
    const byStage: Record<string, number> = {};
    for (const c of scored) {
      const key = c.stage ?? "Unknown";
      byStage[key] = (byStage[key] ?? 0) + 1;
    }
    const histogram = histogramBuckets(
      scored.map((c) => c.ssiScore!).filter((s): s is number => typeof s === "number"),
    );
    const p0p1 = scored
      .filter((c) => c.priority === "P0" || c.priority === "P1")
      .sort((a, b) => (b.ssiScore ?? 0) - (a.ssiScore ?? 0));
    return { all: scored, byTier, byStage, histogram, p0p1 };
  } catch (e) {
    console.error("[getPipeline]", e);
    return {
      all: [],
      byTier: { HOT: 0, WARM: 0, WATCH: 0, EARLY: 0 },
      byStage: {},
      histogram: histogramBuckets([]),
      p0p1: [],
    };
  }
}

function isoWeekLabel(date: Date): { key: string; start: string } {
  // ISO week: Monday-start, year-W##
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const key = `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  const monday = new Date(date);
  const day = monday.getUTCDay() || 7;
  monday.setUTCDate(monday.getUTCDate() - day + 1);
  return { key, start: monday.toISOString().slice(0, 10) };
}

export async function getSignalVelocity(weeks = 26): Promise<SignalVelocityData> {
  try {
    const signals = await allSignals();
    const now = new Date();
    const buckets = new Map<string, VelocityWeek>();
    for (let i = weeks - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i * 7);
      const { key, start } = isoWeekLabel(d);
      if (!buckets.has(key)) buckets.set(key, { week: key, weekStart: start, total: 0, strong: 0 });
    }
    for (const s of signals) {
      const d = new Date(s.dateDetected);
      if (Number.isNaN(d.getTime())) continue;
      const { key, start } = isoWeekLabel(d);
      const b = buckets.get(key) ?? { week: key, weekStart: start, total: 0, strong: 0 };
      b.total += 1;
      if (s.strength === "Strong") b.strong += 1;
      if (!buckets.has(key)) buckets.set(key, b);
    }
    const sorted = Array.from(buckets.values())
      .sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1))
      .slice(-weeks);

    const latest = sorted[sorted.length - 1];
    const latestWeekTotal = latest?.total ?? 0;
    const trailing = sorted.slice(-5, -1);
    const trailing4wkAvg =
      trailing.length === 0
        ? 0
        : trailing.reduce((a, w) => a + w.total, 0) / trailing.length;
    const deltaPct =
      trailing4wkAvg === 0
        ? 0
        : ((latestWeekTotal - trailing4wkAvg) / trailing4wkAvg) * 100;

    const typeCounts = new Map<SignalType, number>();
    for (const s of signals) {
      if (!s.signalType) continue;
      typeCounts.set(s.signalType, (typeCounts.get(s.signalType) ?? 0) + 1);
    }
    const topSignalTypes = Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    return {
      weeks: sorted,
      latestWeekTotal,
      trailing4wkAvg,
      deltaPct,
      topSignalTypes,
    };
  } catch (e) {
    console.error("[getSignalVelocity]", e);
    return { weeks: [], latestWeekTotal: 0, trailing4wkAvg: 0, deltaPct: 0, topSignalTypes: [] };
  }
}

export async function getTopByScore(limit = 5): Promise<PipelineCompany[]> {
  try {
    const companies = await allCompanies();
    const activeStatuses = new Set<PipelineStatus>(["Outreach", "Call Scheduled", "Memo Written"]);
    return companies
      .filter((c) => c.ssiScore !== null && c.status && activeStatuses.has(c.status))
      .sort((a, b) => (b.ssiScore ?? 0) - (a.ssiScore ?? 0))
      .slice(0, limit);
  } catch (e) {
    console.error("[getTopByScore]", e);
    return [];
  }
}

export async function getLatestPosts(): Promise<{ featured: BlogPost | null; recent: BlogPost[] }> {
  try {
    const posts = await allPosts();
    const published = posts.filter((p) => p.publishedDate);
    const featured = published.find((p) => p.featured) ?? null;
    const recent = published.filter((p) => !featured || p.id !== featured.id).slice(0, 3);
    return { featured, recent };
  } catch (e) {
    console.error("[getLatestPosts]", e);
    return { featured: null, recent: [] };
  }
}

const PASS_REASONS: readonly PassReason[] = [
  "Wrapper/No Moat",
  "Consulting-as-Software",
  "Too Early",
  "Geographic Misfit",
  "Commoditization Risk",
  "Founder Concerns",
  "Market Too Small",
  "Acquired/Dead",
] as const;

function matchPassReason(raw: string | null): PassReason | null {
  if (!raw) return null;
  for (const r of PASS_REASONS) if (r === raw) return r;
  return null;
}

export async function getFunnel(): Promise<FunnelData> {
  try {
    const { NOTION_DEALFLOW_DB } = getEnv();
    const pages = await queryAll({ data_source_id: NOTION_DEALFLOW_DB });

    let screened = 0;
    let scored = 0;
    let outreach = 0;
    let memo = 0;
    let passed = 0;
    const passCounts = new Map<PassReason, number>();
    const killSamples: string[] = [];

    for (const page of pages) {
      screened += 1;
      const p = page.properties;
      const statusRaw = selectName(p["Status"]);
      const ssi = num(p["SSI Score"]);
      const isScored =
        ssi !== null ||
        (statusRaw?.includes("Scored") ?? false) ||
        (statusRaw?.includes("Outreach") ?? false) ||
        (statusRaw?.includes("Call") ?? false) ||
        (statusRaw?.includes("Memo") ?? false) ||
        (statusRaw?.includes("Pass") ?? false);
      if (isScored) scored += 1;
      if (
        statusRaw?.includes("Outreach") ||
        statusRaw?.includes("Call") ||
        statusRaw?.includes("Memo")
      ) {
        outreach += 1;
      }
      if (statusRaw?.includes("Memo")) memo += 1;
      if (statusRaw?.includes("Pass")) {
        passed += 1;
        const reasonRaw = selectName(p["Pass Reason"]);
        const reason = matchPassReason(reasonRaw);
        if (reason) passCounts.set(reason, (passCounts.get(reason) ?? 0) + 1);
        const kill = richText(p["Kill Criteria"]);
        if (kill && killSamples.length < 3) killSamples.push(kill);
      }
    }

    const stages: FunnelStage[] = [
      { key: "Screened", label: "Screened", count: screened },
      { key: "Scored", label: "Scored", count: scored },
      { key: "Outreach", label: "Engaged", count: outreach },
      { key: "Memo", label: "Memo", count: memo },
      { key: "Passed", label: "Passed", count: passed },
    ];

    const passReasons = Array.from(passCounts.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);

    return {
      stages,
      totalScreened: screened,
      totalPassed: passed,
      passReasons,
      killCriteriaSamples: killSamples,
    };
  } catch (e) {
    console.error("[getFunnel]", e);
    return {
      stages: [
        { key: "Screened", label: "Screened", count: 0 },
        { key: "Scored", label: "Scored", count: 0 },
        { key: "Outreach", label: "Engaged", count: 0 },
        { key: "Memo", label: "Memo", count: 0 },
        { key: "Passed", label: "Passed", count: 0 },
      ],
      totalScreened: 0,
      totalPassed: 0,
      passReasons: [],
      killCriteriaSamples: [],
    };
  }
}

const ACTIONABLE_SIGNAL_ACTIONS = new Set([
  "Added to Pipeline",
  "Deep-Dive Triggered",
  "Outreach Sent",
]);

export async function getScouting(): Promise<ScoutingData> {
  try {
    const { NOTION_DEALFLOW_DB, NOTION_SIGNAL_DB } = getEnv();
    const [companyPages, signalPages] = await Promise.all([
      queryAll({ data_source_id: NOTION_DEALFLOW_DB }),
      queryAll({ data_source_id: NOTION_SIGNAL_DB }),
    ]);

    const disc = new Map<string, number>();
    for (const page of companyPages) {
      const src = selectName(page.properties["Discovery Source"]);
      if (src) disc.set(src, (disc.get(src) ?? 0) + 1);
    }

    const evi = new Map<string, number>();
    const act = new Map<string, number>();
    let totalSignals = 0;
    let actionable = 0;
    for (const page of signalPages) {
      totalSignals += 1;
      const ev = selectName(page.properties["Evidence Source Type"]);
      if (ev) evi.set(ev, (evi.get(ev) ?? 0) + 1);
      const a = selectName(page.properties["Action Taken"]);
      if (a) {
        act.set(a, (act.get(a) ?? 0) + 1);
        if (ACTIONABLE_SIGNAL_ACTIONS.has(a)) actionable += 1;
      }
    }

    const toList = (m: Map<string, number>): ScoutingChannelCount[] =>
      Array.from(m.entries())
        .map(([key, count]) => ({ key, label: key, count }))
        .sort((a, b) => b.count - a.count);

    return {
      discoverySources: toList(disc),
      evidenceTypes: toList(evi),
      actions: toList(act),
      conversionRate: totalSignals === 0 ? 0 : (actionable / totalSignals) * 100,
      totalSignals,
    };
  } catch (e) {
    console.error("[getScouting]", e);
    return {
      discoverySources: [],
      evidenceTypes: [],
      actions: [],
      conversionRate: 0,
      totalSignals: 0,
    };
  }
}

export async function getInfraCounts(): Promise<InfraCounts> {
  try {
    const [companies, signals, theses, posts] = await Promise.all([
      allCompanies(),
      allSignals(),
      extractTheses(),
      allPosts(),
    ]);
    const lastWrites = [
      ...companies.map((c) => c.lastEditedAt),
    ];
    const lastWriteAt = lastWrites.sort().at(-1) ?? new Date().toISOString();
    return {
      companies: companies.length,
      signals: signals.length,
      theses: theses.length,
      posts: posts.length,
      lastWriteAt,
    };
  } catch (e) {
    console.error("[getInfraCounts]", e);
    return {
      companies: 0,
      signals: 0,
      theses: 0,
      posts: 0,
      lastWriteAt: new Date().toISOString(),
    };
  }
}
