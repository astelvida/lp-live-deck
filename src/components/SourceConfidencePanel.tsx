import type { QualityGates } from "@/lib/types";

export function SourceConfidencePanel({
  data,
}: {
  data: QualityGates["sourceConfidence"];
}) {
  const items: Array<{
    label: string;
    multiplier: string;
    count: number;
    color: string;
  }> = [
    {
      label: "High",
      multiplier: "1.0x",
      count: data.high,
      color: "var(--color-live)",
    },
    {
      label: "Medium",
      multiplier: "0.85x",
      count: data.medium,
      color: "var(--color-amber)",
    },
    {
      label: "Low",
      multiplier: "0.60x",
      count: data.low,
      color: "var(--color-signal)",
    },
  ];
  return (
    <div>
      <div
        className="mb-2 text-[8px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Source confidence weighting
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded border border-[var(--color-rule)] bg-white px-2 py-2 text-center"
          >
            <div
              className="text-[14px] font-medium leading-none tabular-nums text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {item.count}
            </div>
            <div
              className="mt-1 text-[7px] uppercase tracking-[0.06em]"
              style={{ fontFamily: "var(--font-mono)", color: item.color }}
            >
              {item.label} · {item.multiplier}
            </div>
          </div>
        ))}
      </div>
      <p
        className="mt-2 text-[8px] leading-relaxed text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Adjusted SSI = Raw SSI × confidence factor. Drives priority band
        assignment.
        {data.notSet > 0 ? ` · ${data.notSet} unweighted.` : null}
      </p>
    </div>
  );
}
