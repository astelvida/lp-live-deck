import type { HeatTier } from "./types";

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

// Never round SSI scores — show exact Notion values.
// This helper preserves the full precision but caps trailing zeros for display.
export function formatSSI(score: number | null | undefined): string {
  if (score === null || score === undefined || Number.isNaN(score)) return "—";
  const str = String(score);
  return str;
}

export function histogramBuckets(scores: number[]): Array<{ bucket: string; count: number }> {
  const bins = [
    "0-9",
    "10-19",
    "20-29",
    "30-39",
    "40-49",
    "50-59",
    "60-69",
    "70-79",
    "80-89",
    "90-100",
  ];
  const counts = new Array(bins.length).fill(0) as number[];
  for (const s of scores) {
    if (s >= 90) counts[9]! += 1;
    else {
      const idx = Math.min(9, Math.max(0, Math.floor(s / 10)));
      counts[idx]! += 1;
    }
  }
  return bins.map((bucket, i) => ({ bucket, count: counts[i]! }));
}
