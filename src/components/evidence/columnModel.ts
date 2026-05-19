// Single source of truth for the Evidence-table columns. Adding a new column
// means: declare it here, add a `case` in EvidenceRow's Cell switch, and (if
// sortable) add a branch in the comparator in EvidenceTable. No other file
// touches the column list — presets are derived from `presets` here.

import type { PresetId } from "@/components/evidence/ViewPresetSwitcher";

export type ColumnKey =
  | "company"
  | "thesis"
  | "adjSsi"
  | "tier"
  | "sector"
  | "stage"
  | "status"
  | "raisingLikelihood"
  | "idleDays"
  | "discoverySource"
  | "totalFunding"
  | "falsifier"
  | "antiThesis"
  | "icMemo"
  | "founders"
  | "founderHighlights"
  | "customerType"
  | "catalyst"
  | "headcountDelta"
  | "linkedinDelta"
  | "sigs"
  | "expand";

export interface Column {
  key: ColumnKey;
  label: string;
  width: number;
  align?: "left" | "right";
  sortable?: boolean;
  // Left-position offset in px when sticky. Undefined means non-sticky.
  // Currently sticky: company (0), thesis (220), adjSsi (300) — the three
  // anchor columns that should always stay in view during horizontal scroll.
  stickyLeft?: number;
  // Presets that show this column. "all" is a sentinel for always-visible.
  presets: PresetId[] | "all";
}

export const COLUMNS: readonly Column[] = [
  {
    key: "company",
    label: "Company",
    width: 220,
    sortable: true,
    stickyLeft: 0,
    presets: "all",
  },
  {
    key: "thesis",
    label: "Thesis",
    width: 80,
    sortable: true,
    stickyLeft: 220,
    presets: "all",
  },
  {
    key: "adjSsi",
    label: "Adj. SSI",
    width: 160,
    sortable: true,
    stickyLeft: 300,
    presets: "all",
  },
  { key: "tier", label: "Tier", width: 56, sortable: true, presets: "all" },
  { key: "sector", label: "Sector", width: 130, sortable: true, presets: "all" },
  {
    key: "stage",
    label: "Stage",
    width: 90,
    sortable: true,
    presets: ["sourcing", "ic-prep"],
  },
  {
    key: "status",
    label: "Status",
    width: 130,
    sortable: true,
    presets: ["sourcing"],
  },
  {
    key: "raisingLikelihood",
    label: "Raising",
    width: 90,
    sortable: true,
    presets: ["sourcing", "ic-prep"],
  },
  {
    key: "idleDays",
    label: "Idle",
    width: 70,
    sortable: true,
    align: "right",
    presets: ["sourcing"],
  },
  {
    key: "discoverySource",
    label: "Source",
    width: 100,
    sortable: true,
    presets: ["sourcing"],
  },
  {
    key: "totalFunding",
    label: "Funding",
    width: 90,
    sortable: true,
    align: "right",
    presets: ["ic-prep", "catalyst"],
  },
  {
    key: "falsifier",
    label: "Falsifier",
    width: 90,
    sortable: true,
    presets: ["ic-prep"],
  },
  {
    key: "antiThesis",
    label: "Anti-thesis",
    width: 100,
    sortable: true,
    presets: ["ic-prep"],
  },
  {
    key: "icMemo",
    label: "IC Memo",
    width: 110,
    sortable: true,
    presets: ["ic-prep"],
  },
  {
    key: "founders",
    label: "Founders",
    width: 160,
    sortable: true,
    presets: ["founders"],
  },
  {
    key: "founderHighlights",
    label: "Highlights",
    width: 200,
    sortable: false,
    presets: ["founders"],
  },
  {
    key: "customerType",
    label: "Customer",
    width: 90,
    sortable: true,
    presets: ["founders"],
  },
  {
    key: "catalyst",
    label: "Catalyst",
    width: 110,
    sortable: true,
    align: "right",
    presets: ["catalyst"],
  },
  {
    key: "headcountDelta",
    label: "HC Δ 90d",
    width: 90,
    sortable: true,
    align: "right",
    presets: ["catalyst"],
  },
  {
    key: "linkedinDelta",
    label: "LI Δ 90d",
    width: 90,
    sortable: true,
    align: "right",
    presets: ["catalyst"],
  },
  {
    key: "sigs",
    label: "Sigs",
    width: 56,
    sortable: true,
    align: "right",
    presets: "all",
  },
  { key: "expand", label: "", width: 36, sortable: false, presets: "all" },
];

export function columnsForPreset(preset: PresetId): readonly Column[] {
  return COLUMNS.filter(
    (c) => c.presets === "all" || c.presets.includes(preset),
  );
}
