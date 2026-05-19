import type { RaisingLikelihood } from "@/lib/types";

// Active rounds are the highest-priority signal on this whole table — they get
// a red ring on top of the red fill so they pop even at a glance.

const TONE: Record<RaisingLikelihood, string> = {
  Low: "bg-[var(--color-paper-deep)] text-[var(--color-ink-mute)] border-[var(--color-rule)]",
  Medium:
    "bg-[oklch(0.97_0.05_70)] text-[oklch(0.45_0.13_70)] border-[var(--color-amber)]",
  High: "bg-[oklch(0.96_0.07_50)] text-[oklch(0.50_0.16_50)] border-[oklch(0.55_0.18_50)]",
  Active:
    "bg-[var(--color-signal-soft)] text-[var(--color-signal)] border-[var(--color-signal)] ring-1 ring-[var(--color-signal)] ring-offset-1 ring-offset-white",
};

export function RaisingLikelihoodPill({
  value,
}: {
  value: RaisingLikelihood | null;
}) {
  if (!value) {
    return (
      <span
        className="text-[10px] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        —
      </span>
    );
  }
  return (
    <span
      className={`inline-block rounded border-[0.5px] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] ${TONE[value]}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {value}
    </span>
  );
}
