import type { ThesisKey } from "./thesis-canon";

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
  | "Pass"
  | "Archived";

export type SourceConfidence = "High" | "Medium" | "Low";
export type FalsifierStatus = "Clean" | "Triggered" | "Not Run";
export type AntiThesisStatus = "Clear" | "1 Flag" | "Auto-pass" | "Not Run";
export type ICMemoStatus =
  | "Not Started"
  | "Draft"
  | "In Review"
  | "Approved"
  | "Passed";

// Harmonic/PitchBook-aligned enums for the Evidence table redesign.
export type CustomerType = "B2B" | "B2C" | "B2G" | "B2B+B2C" | "B2B+B2G";
export type Ownership =
  | "Private"
  | "Public"
  | "Acquired"
  | "Dead/Defunct"
  | "Stealth";
export type WebTrafficTrend = "Up" | "Flat" | "Down" | "N/A";
export type RaisingLikelihood = "Low" | "Medium" | "High" | "Active";
export type StackREVector = "Customer" | "Competitor" | "Tech partner";
export type NextAction =
  | "Research"
  | "Reach Out"
  | "Draft Memo"
  | "Track"
  | "Pass";

export interface PipelineCompany {
  id: string;
  name: string;
  ssiScore: number | null;
  adjustedSsi: number | null;
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
  // Two-Thesis Canonical v2.0
  sourceConfidence: SourceConfidence | null;
  falsifierCheck: FalsifierStatus | null;
  antiThesisFilter: AntiThesisStatus | null;
  icMemoStatus: ICMemoStatus | null;
  discoverySource: string | null;
  headcount: number | null;
  founded: number | null;
  lastRaise: string | null;
  lastScored: string | null;
  // ---- v3: already in Notion, newly read by the deck ----
  linkedinUrl: string | null;
  raisingLikelihood: RaisingLikelihood | null;
  nextAction: NextAction | null;
  idleDays: number | null;             // from "Idle Days" formula
  catalystWindowDays: number | null;   // days until primary catalyst
  primaryCatalyst: string | null;      // resolved title; null when relation empty or unresolved
  stackREVector: StackREVector | null;
  passReason: string | null;
  lastVerified: string | null;
  // ---- v3: Harmonic-style Tier 1 (manual entry in Notion) ----
  founders: string | null;             // rich_text, one founder per line
  founderHighlights: string[];         // multi_select names
  customerType: CustomerType | null;
  totalFundingUsd: number | null;
  lastRoundAmountUsd: number | null;
  lastRoundDate: string | null;
  notableInvestors: string[];          // multi_select names
  ownership: Ownership | null;
  founderLinkedin: string | null;
  // ---- v3: Harmonic-style Tier 2 (traction/momentum; renders empty-state until populated) ----
  headcount90dDeltaPct: number | null;
  linkedinFollowers: number | null;
  linkedinFollowers90dDeltaPct: number | null;
  githubStars: number | null;
  webTrafficTrend: WebTrafficTrend | null;
}

export type Novelty = "New" | "Repeated" | "Escalating";
export type EvidenceQuality = "Primary" | "Secondary" | "Tertiary";

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
  | "Regulator Integration"
  | "Score Update"
  | "Patent Filing"
  | "EU Grant"
  | "Academic Spinout";

export type SignalStrength = "Strong" | "Moderate" | "Weak";

export interface SignalRecord {
  id: string;
  title: string;
  detail: string | null;
  dateDetected: string;
  week: string | null;
  signalType: SignalType | null;
  strength: SignalStrength | null;
  thesisRelevance: string[];
  sourceChannel: string | null;
  company: string | null;
  novelty: Novelty | null;
  evidenceQuality: EvidenceQuality | null;
  evidenceSourceType: string | null;
  memoCandidate: boolean;
  disqualifying: boolean;
  verified: boolean;
  sourceUrl: string | null;
  actionTaken: string | null;
}

// ---- Hero ----
export interface HeroThesisMini {
  key: ThesisKey;
  number: 1 | 2;
  title: string;
  shortDescription: string;
  regulatoryPills: string[];
  companyCount: number;
  thesisFitCount: number; // P0+P1 in this thesis
}

export interface HeroLatestSignal {
  title: string;
  company: string | null;
  week: string | null;
  sourceChannel: string | null;
  strength: SignalStrength | null;
  novelty: Novelty | null;
}

export interface HeroData {
  // 4-metric grid
  companiesTracked: number;
  signalsLogged: number;
  avgAdjustedSsi: number | null;
  p0p1Count: number;
  // 3-stat triplet
  memoReady: number;
  outreachActive: number;
  escalatingSignals: number;
  // Right column
  theses: HeroThesisMini[];
  latestSignal: HeroLatestSignal | null;
  generatedAt: string;
}

// ---- Thesis section ----
export interface ThesisCompany {
  id: string;
  name: string;
  ssiScore: number | null;
  adjustedSsi: number | null;
  priority: Priority | null;
}

export interface ThesisEvidenceBullet {
  id: string;
  title: string;
  detail: string | null;
  week: string | null;
  sourceChannel: string | null;
  signalType: SignalType | null;
  novelty: Novelty | null;
  isFresh: boolean; // last 30 days
}

export interface Thesis {
  key: ThesisKey;
  number: 1 | 2;
  title: string;
  shortTitle: string;
  coreBet: string;
  antiThesis: string;
  subSegments: string[];
  regulatoryPills: string[];
  companies: ThesisCompany[];
  totalCompanies: number;
  thesisFitCount: number;
  evidence: ThesisEvidenceBullet[];
  strongSignals90d: number;
}

// ---- Pipeline section ----
export interface FunnelStage {
  key: "Research" | "Scored" | "Outreach" | "Call Scheduled" | "Memo Written";
  label: string;
  icon: string;
  count: number;
  pct: number;
}

export interface SSIBand {
  key: "P0" | "P1" | "P2" | "P3-mid" | "P3-low";
  label: string;
  range: string;
  count: number;
  pct: number;
  priorityNote: string;
}

export interface DiscoverySourceBar {
  key: string;
  label: string;
  count: number;
}

export interface QualityGates {
  // Source confidence weighting
  sourceConfidence: {
    high: number;
    medium: number;
    low: number;
    notSet: number;
  };
  // Falsifier check
  falsifier: {
    clean: number;
    triggered: number;
    notRun: number;
  };
  // Anti-thesis filter
  antiThesis: {
    clear: number;
    flagged: number;
    autoPass: number;
    notRun: number;
  };
}

export interface PipelineData {
  // 4 top stats
  totalActive: number;
  p0p1Count: number;
  avgAdjustedSsi: number | null;
  icMemoApproved: number;
  // Funding stage pills (Pre-Seed/Seed/Series A/Series B/Growth)
  fundingStages: Array<{ stage: string; count: number }>;
  // Workflow funnel
  funnel: FunnelStage[];
  // SSI 100-scale histogram with priority bands
  ssiBands: SSIBand[];
  // Discovery sources
  discoverySources: DiscoverySourceBar[];
  // Quality gates
  qualityGates: QualityGates;
}

// ---- Signal velocity section ----
export interface VelocityWeek {
  week: string; // "W##-YYYY"
  weekStart: string;
  total: number;
  strong: number;
}

export interface ThisWeekPulse {
  total: number;
  strong: number;
  escalating: number;
}

export interface SignalVelocityData {
  weeks: VelocityWeek[];
  twelveWeekAvg: number;
  thisWeek: ThisWeekPulse;
  topSignalTypes: Array<{ type: SignalType; count: number }>;
  otherSignalCount: number;
  noveltyBreakdown: { new: number; repeated: number; escalating: number };
  evidenceQuality: { primary: number; secondary: number; tertiary: number };
  byThesisRelevance: {
    "Governed Agentic Ops": number;
    "Vertical SoR AI": number;
    both: number;
  };
  disqualifying: number;
  memoCandidates: number;
}

// ---- Evidence section ----
export interface EvidenceCompany extends PipelineCompany {
  thesisBadge: ThesisKey | "Both" | null;
  recentSignals: SignalRecord[];
}

export interface EvidenceData {
  companies: EvidenceCompany[];
}

// ---- Writing (unchanged) ----
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
