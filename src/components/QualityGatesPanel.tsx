import type { QualityGates } from "@/lib/types";

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9px] text-[var(--color-ink-soft)]">{label}</span>
      <span
        className="text-[9px] tabular-nums"
        style={{
          fontFamily: "var(--font-mono)",
          color: color ?? "var(--color-ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function QualityGatesPanel({ data }: { data: QualityGates }) {
  const falsifierTotal =
    data.falsifier.clean + data.falsifier.triggered + data.falsifier.notRun;
  const falsifierRun = data.falsifier.clean + data.falsifier.triggered;
  const hasFalsifierData = falsifierRun > 0;
  const hasAntiThesisData =
    data.antiThesis.clear + data.antiThesis.flagged + data.antiThesis.autoPass > 0;

  return (
    <div>
      <div
        className="mb-2 text-[8px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Quality gates
      </div>
      <div className="flex flex-col gap-1.5">
        <Row
          label="Falsifier check run"
          value={
            hasFalsifierData
              ? `${falsifierRun} / ${falsifierTotal}`
              : `— / ${falsifierTotal} · awaiting run`
          }
          color={hasFalsifierData ? "var(--color-live)" : "var(--color-ink-mute)"}
        />
        <Row
          label="Anti-thesis · Clear"
          value={hasAntiThesisData ? data.antiThesis.clear : "—"}
        />
        <Row
          label="Anti-thesis · 1 Flag"
          value={hasAntiThesisData ? data.antiThesis.flagged : "—"}
          color="var(--color-amber)"
        />
        <Row
          label="Auto-pass triggered"
          value={data.antiThesis.autoPass > 0 ? data.antiThesis.autoPass : "—"}
          color={
            data.antiThesis.autoPass > 0
              ? "var(--color-signal)"
              : "var(--color-ink-mute)"
          }
        />
      </div>
      {!hasFalsifierData && !hasAntiThesisData ? (
        <p
          className="mt-2 text-[8px] leading-relaxed text-[var(--color-ink-mute)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Gates light up as falsifier + anti-thesis runs are logged in Notion.
        </p>
      ) : null}
    </div>
  );
}
