// Percent-delta arrow used for Headcount Δ and LinkedIn Followers Δ.
// Threshold ±0.5% to avoid arrow flicker on noise; below that we render a
// neutral right arrow. Sign is always shown so "+0%" is distinguishable from
// missing data ("—").

export function TrendArrow({
  value,
  suffix = "%",
}: {
  value: number | null;
  suffix?: string;
}) {
  if (value === null || value === undefined) {
    return (
      <span
        className="text-[10px] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        —
      </span>
    );
  }
  const dir = value > 0.5 ? "up" : value < -0.5 ? "down" : "flat";
  const arrow = dir === "up" ? "↗" : dir === "down" ? "↘" : "→";
  const color =
    dir === "up"
      ? "text-[var(--color-live-green)]"
      : dir === "down"
        ? "text-[var(--color-signal)]"
        : "text-[var(--color-ink-soft)]";
  const sign = value > 0 ? "+" : "";
  return (
    <span
      className={`inline-flex items-baseline gap-0.5 text-[10px] tabular-nums ${color}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span>
        {sign}
        {value.toFixed(0)}
        {suffix}
      </span>
      <span aria-hidden="true">{arrow}</span>
    </span>
  );
}
