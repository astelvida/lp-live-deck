// Countdown badge driven by Notion's `Catalyst Window (days)` field.
// Color coding follows urgency, not theme: under 30d goes red (act now),
// 30-90d goes amber (watch), 90+ stays neutral. Null renders an em-dash.
// The "days from today" interpretation is documented in CLAUDE.md.

export function CatalystCountdown({ days }: { days: number | null }) {
  if (days === null || days === undefined) {
    return (
      <span
        className="text-[10px] tabular-nums text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        —
      </span>
    );
  }
  const tone =
    days < 30
      ? "border-[var(--color-signal)] text-[var(--color-signal)] bg-[var(--color-signal-soft)]"
      : days < 90
        ? "border-[var(--color-amber)] text-[oklch(0.45_0.13_70)] bg-[oklch(0.98_0.04_70)]"
        : "border-[var(--color-rule)] text-[var(--color-ink-soft)] bg-white";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border-[0.5px] px-1.5 py-0.5 text-[10px] tabular-nums ${tone}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      T−{days}d
    </span>
  );
}
