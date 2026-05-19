// Canonical names match the Notion `Thesis` multi-select (Companies) and
// `Thesis Relevance` multi-select (Signals) exactly. Renaming here without
// renaming the Notion options silently drops rows from the deck.
export const THESIS_KEYS = [
  "Governed Agentic Ops",
  "Vertical SoR AI",
] as const;
export type ThesisKey = (typeof THESIS_KEYS)[number];

// Companies use "Both" to indicate cross-thesis fit; signals do not.
export const THESIS_COMPANY_MATCHERS: Record<ThesisKey, string[]> = {
  "Governed Agentic Ops": ["Governed Agentic Ops", "Both"],
  "Vertical SoR AI": ["Vertical SoR AI", "Both"],
};

export const THESIS_SIGNAL_MATCHERS: Record<ThesisKey, string[]> = {
  "Governed Agentic Ops": ["Governed Agentic Ops"],
  "Vertical SoR AI": ["Vertical SoR AI"],
};

export interface ThesisCanonical {
  key: ThesisKey;
  number: 1 | 2;
  title: string;
  shortTitle: string;
  coreBet: string;
  whatWeUnderwrite: string;
  antiThesis: string;
  subSegments: string[];
  regulatoryPills: string[];
}

// Sourced from "Investment Thesis Pack — Two-Thesis Canonical v2.0" (May 2026).
// Used as the rendering source of truth; the Notion page parser overlays any
// fresher text on top of these defaults.
export const THESIS_CANON: Record<ThesisKey, ThesisCanonical> = {
  "Governed Agentic Ops": {
    key: "Governed Agentic Ops",
    number: 1,
    title: "Governed Agentic Ops",
    shortTitle: "GAO",
    coreBet:
      "The next durable AI infrastructure layer in regulated Europe will not be a model. It will be the deployment gateway.",
    whatWeUnderwrite:
      "Runtime governance platforms, sector-specialised agent ops, and audit/evidence infrastructure.",
    antiThesis:
      "Dashboards that observe but cannot intervene; responsible-AI documentation tooling without runtime control.",
    subSegments: [
      "Runtime agent governance (Head of AI / CISO)",
      "AI observability + eval infra",
      "Finserv-specialised governance (DORA + AI Act)",
      "Healthcare-specialised governance (MDR/AI Act)",
    ],
    regulatoryPills: ["DORA", "EU AI Act Art. 6", "AMLA", "NIS2"],
  },
  "Vertical SoR AI": {
    key: "Vertical SoR AI",
    number: 2,
    title: "Vertical System-of-Record AI",
    shortTitle: "VSRAI",
    coreBet:
      "The most durable vertical AI companies will become, extend, or control the system of record where regulated work is created and verified.",
    whatWeUnderwrite:
      "Workflow-native AI, bidirectional integrations (Epic, Guidewire), new regulated record categories.",
    antiThesis:
      "Copilots that read but cannot write back; horizontal AI with a sector landing page.",
    subSegments: [
      "Clinical documentation & ambient AI",
      "MedTech regulatory affairs platforms",
      "AML investigator workflow",
      "Claims & underwriting AI",
    ],
    regulatoryPills: ["MDR / IVDR", "AMLA", "EHDS", "EU AI Act"],
  },
};

// Shared regulatory catalyst window — rendered under Thesis 01.
export interface RegulatoryCatalyst {
  label: string;
  date: string;
  status: "live" | "approaching" | "future";
  daysUntil?: number | null;
}

export const REGULATORY_CATALYSTS: RegulatoryCatalyst[] = [
  { label: "DORA full enforcement", date: "Jan 2025", status: "live" },
  { label: "EU AI Act Annex III", date: "Aug 2026", status: "approaching" },
  { label: "EHDS general application", date: "2027", status: "future" },
  { label: "AMLA direct supervision", date: "2028", status: "future" },
];

// GRR benchmark — rendered under Thesis 02.
export const GRR_BENCHMARK = {
  embedded: { label: "Write-loop embedded", value: "70–95% GRR" },
  overlay: { label: "Overlay / wrapper tools", value: "~40% GRR" },
  test: "Moat test: does removing the AI break the workflow? If yes → SoR-embedded. If no → overlay. Overlay = auto-pass.",
} as const;
