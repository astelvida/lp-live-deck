export type HeatTier = "HOT" | "WARM" | "WATCH" | "EARLY";

export type Priority = "P0" | "P1" | "P2" | "P3";

export type SignalTier =
  | "Highest Conviction"
  | "Strong"
  | "Emerging"
  | "Watchlist";

export type PipelineStatus =
  | "Research"
  | "Scored"
  | "Outreach"
  | "Call Scheduled"
  | "Memo Written"
  | "Paused"
  | "Pass";

export interface PipelineCompany {
  id: string;
  name: string;
  ssiScore: number | null;
  heatTier: HeatTier | null;
  signalTier: SignalTier | null;
  priority: Priority | null;
  status: PipelineStatus | null;
  stage: string | null;
  sector: string | null;
  theses: string[];
  oneLiner: string | null;
  hq: string | null;
  website: string | null;
  signalCount: number;
  regulatoryEmbeddedness: number | null;
  keySignal30d: string | null;
  lastSignalDate: string | null;
  lastEditedAt: string;
}

export interface HeroStats {
  pipelineCount: number;
  signals7d: number;
  signals30d: number;
  totalSignals: number;
  topPriorityCompanies: Array<Pick<PipelineCompany, "name" | "ssiScore" | "sector">>;
  generatedAt: string;
}

export type ThesisCategory = "Vertical AI" | "Infrastructure" | "Applied AI" | "Regulation";
export type ThesisConviction = "High" | "Medium" | "Developing";
export type VisualStyle = "Converging" | "Expanding" | "Fragmenting" | "Emerging";

export interface ThesisCompany {
  id: string;
  name: string;
  ssiScore: number | null;
  priority: Priority | null;
}

export interface Thesis {
  id: string;
  number: number;
  title: string;
  category: ThesisCategory | null;
  conviction: ThesisConviction | null;
  contrarianHook: string | null;
  marketSize: string | null;
  investmentCriteria: string | null;
  keyRisks: string | null;
  regulatoryCatalystDate: string | null;
  visualStyle: VisualStyle | null;
  companiesTracked: number;
  slug: string | null;
  topCompanies: ThesisCompany[];
  strongSignals90d: number;
}

export type SignalType =
  | "Funding"
  | "Senior Hire"
  | "GitHub Spike"
  | "Sandbox Acceptance"
  | "Procurement Win"
  | "Customer Reference"
  | "Conference Speaker"
  | "Product Launch"
  | "Partnership"
  | "Regulatory Filing"
  | "Regulatory Embeddedness"
  | "Standards Body"
  | "Regulator Integration";

export type SignalStrength = "Strong" | "Moderate" | "Weak";

export interface SignalRecord {
  id: string;
  title: string;
  dateDetected: string;
  week: string | null;
  signalType: SignalType | null;
  strength: SignalStrength | null;
  thesisRelevance: string[];
  sourceChannel: string | null;
  company: string | null;
}

export interface VelocityWeek {
  week: string;
  weekStart: string;
  total: number;
  strong: number;
}

export interface SignalVelocityData {
  weeks: VelocityWeek[];
  latestWeekTotal: number;
  trailing4wkAvg: number;
  deltaPct: number;
  topSignalTypes: Array<{ type: SignalType; count: number }>;
}

export interface PipelineData {
  all: PipelineCompany[];
  byTier: Record<HeatTier, number>;
  byStage: Record<string, number>;
  histogram: Array<{ bucket: string; count: number }>;
  p0p1: PipelineCompany[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string | null;
  canonicalUrl: string | null;
  excerpt: string | null;
  publishedDate: string | null;
  readingTime: string | null;
  tags: string[];
  format: string | null;
  angle: string | null;
  relatedThesis: string[];
  featured: boolean;
}

export interface InfraCounts {
  companies: number;
  signals: number;
  theses: number;
  posts: number;
  lastWriteAt: string;
}

export type PassReason =
  | "Wrapper/No Moat"
  | "Consulting-as-Software"
  | "Too Early"
  | "Geographic Misfit"
  | "Commoditization Risk"
  | "Founder Concerns"
  | "Market Too Small"
  | "Acquired/Dead";

export interface FunnelStage {
  key: "Screened" | "Scored" | "Outreach" | "Memo" | "Passed";
  label: string;
  count: number;
}

export interface FunnelData {
  stages: FunnelStage[];
  totalScreened: number;
  totalPassed: number;
  passReasons: Array<{ reason: PassReason; count: number }>;
  killCriteriaSamples: string[];
}

export interface ScoutingChannelCount {
  key: string;
  label: string;
  count: number;
}

export interface ScoutingData {
  discoverySources: ScoutingChannelCount[];
  evidenceTypes: ScoutingChannelCount[];
  actions: ScoutingChannelCount[];
  conversionRate: number;
  totalSignals: number;
}
