import type { SSIBand } from "@/lib/types";

const FILLS: Record<SSIBand["key"], { bg: string; opacity: number; mono?: string }> = {
  P0: { bg: "var(--color-signal)", opacity: 1 },
  P1: { bg: "var(--color-signal)", opacity: 0.75 },
  P2: { bg: "var(--color-signal)", opacity: 0.5 },
  "P3-mid": { bg: "var(--color-signal)", opacity: 0.3 },
  "P3-low": { bg: "oklch(0.78 0 0)", opacity: 1 },
};

export function HistogramBars100({ bands }: { bands: SSIBand[] }) {
  const max = Math.max(...bands.map((b) => b.count), 1);
  return (
    <div>
      {bands.map((b) => {
        const fill = FILLS[b.key];
        const widthPct = Math.round((b.count / max) * 100);
        return (
          <div key={b.key} className="mb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-12 shrink-0 text-right text-[9px] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {b.range}
              </span>
              <div className="relative h-3 flex-1 overflow-hidden rounded-sm bg-[var(--color-paper-deep)]">
                <span
                  className="absolute inset-y-0 left-0 block"
                  style={{
                    width: `${widthPct}%`,
                    background: fill.bg,
                    opacity: fill.opacity,
                  }}
                />
              </div>
              <span
                className="w-6 shrink-0 text-right text-[9px] tabular-nums text-[var(--color-ink)]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: b.key === "P0" ? "var(--color-signal)" : undefined,
                }}
              >
                {b.count}
              </span>
              <span
                className="w-8 shrink-0 text-right text-[8px] tabular-nums text-[var(--color-ink-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {b.pct}%
              </span>
            </div>
            {b.priorityNote ? (
              <div
                className="ml-[3.5rem] mt-0.5 text-[8px]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color:
                    b.key === "P0"
                      ? "var(--color-signal)"
                      : "var(--color-ink-mute)",
                }}
              >
                {b.priorityNote}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
