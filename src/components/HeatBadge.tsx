import type { HeatTier } from "@/lib/types";

export function HeatBadge({ tier, count }: { tier: HeatTier | "UNSCORED"; count?: number }) {
  const tone =
    tier === "HOT"
      ? "bg-[var(--color-signal-soft)] text-[var(--color-signal)] border-[var(--color-signal)]/40"
      : tier === "WARM"
        ? "text-[var(--color-clay)] border-[var(--color-clay)]/40"
        : tier === "WATCH"
          ? "text-[var(--color-ink-soft)] border-[var(--color-ink-mute)]"
          : "text-[var(--color-ink-mute)] border-[var(--color-ink-faint)]";

  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] ${tone}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className="font-medium">{tier}</span>
      {count !== undefined && <span className="opacity-70">{count}</span>}
    </span>
  );
}
