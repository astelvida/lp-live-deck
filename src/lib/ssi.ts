import type { HeatTier, Priority, SourceConfidence } from "./types";

export function getHeatTier(score: number | null | undefined): HeatTier | null {
  if (score === null || score === undefined || Number.isNaN(score)) return null;
  if (score >= 75) return "HOT";
  if (score >= 60) return "WARM";
  if (score >= 45) return "WATCH";
  return "EARLY";
}

export function getHeatColor(tier: HeatTier | null): string {
  switch (tier) {
    case "HOT":
      return "var(--color-signal)";
    case "WARM":
      return "var(--color-clay)";
    case "WATCH":
      return "oklch(0.17 0.02 50 / 0.6)";
    case "EARLY":
      return "oklch(0.17 0.02 50 / 0.35)";
    default:
      return "oklch(0.17 0.02 50 / 0.25)";
  }
}

export function getHeatLabel(tier: HeatTier | null): string {
  return tier ?? "UNSCORED";
}

// Priority bands derived from Adjusted SSI (raw × source-confidence multiplier).
// Falls back to raw SSI when Adjusted is null. Matches the wireframe ladder.
export function getPriorityBand(
  adjustedSsi: number | null | undefined,
): Priority | null {
  if (
    adjustedSsi === null ||
    adjustedSsi === undefined ||
    Number.isNaN(adjustedSsi)
  )
    return null;
  if (adjustedSsi >= 80) return "P0";
  if (adjustedSsi >= 65) return "P1";
  if (adjustedSsi >= 50) return "P2";
  return "P3";
}

export function getConfidenceFactor(
  source: SourceConfidence | null | undefined,
): number {
  if (source === "High") return 1.0;
  if (source === "Medium") return 0.85;
  if (source === "Low") return 0.6;
  return 1.0;
}

// Never round SSI scores — show exact Notion values.
export function formatSSI(score: number | null | undefined): string {
  if (score === null || score === undefined || Number.isNaN(score)) return "—";
  return String(score);
}

// Single-decimal display for Adjusted SSI bars/labels in the Evidence table.
export function formatAdjustedSSI(score: number | null | undefined): string {
  if (score === null || score === undefined || Number.isNaN(score)) return "—";
  return score.toFixed(1);
}

// 5-band 100-scale histogram (P0/P1/P2/P3-mid/P3-low) used by Pipeline.
// Returns counts only — callers compute pct + labels.
export function histogramBuckets100(
  scores: number[],
): Array<{ band: "P0" | "P1" | "P2" | "P3-mid" | "P3-low"; count: number }> {
  let p0 = 0;
  let p1 = 0;
  let p2 = 0;
  let p3mid = 0;
  let p3low = 0;
  for (const s of scores) {
    if (s >= 80) p0 += 1;
    else if (s >= 65) p1 += 1;
    else if (s >= 50) p2 += 1;
    else if (s >= 35) p3mid += 1;
    else p3low += 1;
  }
  return [
    { band: "P0", count: p0 },
    { band: "P1", count: p1 },
    { band: "P2", count: p2 },
    { band: "P3-mid", count: p3mid },
    { band: "P3-low", count: p3low },
  ];
}
