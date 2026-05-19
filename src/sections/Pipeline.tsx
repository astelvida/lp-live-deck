import type { PipelineData, SSIBand } from "@/lib/types";
import { QualityGatesPanel } from "@/components/QualityGatesPanel";
import { SourceConfidencePanel } from "@/components/SourceConfidencePanel";
import { NumberCounter } from "@/components/NumberCounter";
import { Reveal } from "@/components/Reveal";

const SSI_BAND_OPACITY: Record<SSIBand["key"], number> = {
  P0: 1,
  P1: 0.78,
  P2: 0.55,
  "P3-mid": 0.32,
  "P3-low": 0.18,
};

function MegaStat({
  value,
  decimals,
  label,
  accent,
  delay,
}: {
  value: number;
  decimals?: number;
  label: string;
  accent?: boolean;
  delay: number;
}) {
  return (
    <div className="border-t border-[var(--color-ink)] pt-3">
      <div
        className={`text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-none tabular-nums ${
          accent ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]"
        }`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <NumberCounter
          value={value}
          decimals={decimals ?? 0}
          delay={delay}
          duration={1.1}
        />
      </div>
      <div
        className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
    </div>
  );
}

function FunnelRow({
  stage,
  width,
  index,
  highlighted,
}: {
  stage: PipelineData["funnel"][number];
  width: number;
  index: number;
  highlighted: boolean;
}) {
  return (
    <div className="group grid grid-cols-[140px_1fr_auto_auto] items-center gap-4 border-b border-dashed border-[var(--color-rule)] py-3 last:border-b-0">
      <div
        className={`flex items-baseline gap-2 text-[12px] uppercase tracking-[0.14em] ${
          highlighted ? "text-[var(--color-signal)]" : "text-[var(--color-ink-soft)]"
        }`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="text-[var(--color-ink-mute)] tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span>{stage.label}</span>
      </div>
      <div className="relative h-3 overflow-hidden bg-[var(--color-paper-deep)]">
        <span
          className={`absolute inset-y-0 left-0 block bar-fill bar-fill-${Math.min(5, index + 1)}`}
          style={{
            width: `${Math.max(1, width)}%`,
            background: "var(--color-signal)",
            opacity: highlighted ? 1 : 0.85,
          }}
        />
      </div>
      <span
        className={`min-w-[40px] text-right text-[14px] font-medium tabular-nums ${
          highlighted ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]"
        }`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {stage.count}
      </span>
      <span
        className="min-w-[44px] text-right text-[10px] uppercase tabular-nums text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {stage.pct}%
      </span>
    </div>
  );
}

function VerticalBars({ bands }: { bands: SSIBand[] }) {
  const max = Math.max(...bands.map((b) => b.count), 1);
  return (
    <div
      className="grid items-end gap-2"
      style={{ gridTemplateColumns: `repeat(${bands.length}, 1fr)`, height: "180px" }}
    >
      {bands.map((b, i) => {
        const heightPct = (b.count / max) * 100;
        const opacity = SSI_BAND_OPACITY[b.key];
        const isP0 = b.key === "P0";
        return (
          <div key={b.key} className="flex h-full flex-col items-center justify-end">
            <div
              className="relative flex w-full flex-col justify-end"
              style={{ height: `${heightPct}%`, minHeight: "2px" }}
            >
              <span
                className="bar-fill-v block w-full"
                style={{
                  background: isP0
                    ? "var(--color-signal)"
                    : i === bands.length - 1
                      ? "oklch(0.75 0 0)"
                      : "var(--color-signal)",
                  opacity,
                  height: "100%",
                  animationDelay: `${100 + i * 100}ms`,
                }}
              />
            </div>
            <div className="mt-2 flex flex-col items-center gap-0.5">
              <span
                className="text-[11px] font-medium tabular-nums"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: isP0 ? "var(--color-signal)" : "var(--color-ink)",
                }}
              >
                {b.count}
              </span>
              <span
                className="text-[8px] uppercase tracking-[0.1em] text-[var(--color-ink-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {b.range}
              </span>
              <span
                className="text-[8px] uppercase tracking-[0.06em]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: isP0 ? "var(--color-signal)" : "var(--color-ink-mute)",
                }}
              >
                {b.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DiscoveryBar({
  d,
  max,
  isTop,
  delayClass,
}: {
  d: PipelineData["discoverySources"][number];
  max: number;
  isTop: boolean;
  delayClass: string;
}) {
  const width = Math.max(2, Math.round((d.count / max) * 100));
  return (
    <div className="group grid grid-cols-[90px_1fr_auto] items-center gap-3 py-1.5">
      <span
        className={`text-[11px] uppercase tracking-[0.06em] transition-colors group-hover:text-[var(--color-signal)] ${
          isTop ? "text-[var(--color-signal)]" : "text-[var(--color-ink-soft)]"
        }`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {d.label}
      </span>
      <div className="relative h-[6px] overflow-hidden bg-[var(--color-paper-deep)]">
        <span
          className={`absolute inset-y-0 left-0 block ${delayClass}`}
          style={{
            width: `${width}%`,
            background: isTop ? "var(--color-signal)" : "var(--color-ink)",
            opacity: isTop ? 0.6 : 0.32,
            transform: "scaleX(0)",
            animation: "bar-fill 900ms var(--ease-editorial) forwards",
          }}
        />
      </div>
      <span
        className="min-w-[28px] text-right text-[12px] tabular-nums text-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {d.count}
      </span>
    </div>
  );
}

export function PipelineSection({ data }: { data: PipelineData }) {
  const maxFunnelCount = Math.max(...data.funnel.map((f) => f.count), 1);
  const discoveryMax = Math.max(...data.discoverySources.map((d) => d.count), 1);

  return (
    <section
      id="pipeline"
      aria-labelledby="pipeline-title"
      className="relative mb-28 scroll-mt-12"
    >
      {/* Section spine + heading */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 md:col-span-2">
          <span
            className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-signal)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            02 / 06
          </span>
          <p
            className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            The Machine
          </p>
        </div>
        <div className="col-span-12 md:col-span-10">
          <Reveal direction="up" duration={0.8}>
            <h2
              id="pipeline-title"
              className="display-hero text-[clamp(2.5rem,5.5vw,4.5rem)] text-[var(--color-ink)]"
            >
              The pipeline,{" "}
              <span className="display-wonk text-[var(--color-signal)]">
                in real time.
              </span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p
              className="pullquote mt-6 max-w-2xl text-[clamp(1.05rem,1.6vw,1.4rem)] text-[var(--color-ink-soft)]"
            >
              {data.totalActive} active companies. {data.p0p1Count} ranked P0 or
              P1. From first signal to IC memo in a sixty-second loop —
              auditable, scored, falsifier-checked, sourced.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Mega stat row */}
      <Reveal direction="fade" duration={0.6} delay={0.25}>
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-10">
          <MegaStat
            value={data.totalActive}
            label="Total active"
            delay={0.3}
          />
          <MegaStat
            value={data.p0p1Count}
            label="P0 + P1 priority"
            accent
            delay={0.4}
          />
          <MegaStat
            value={data.avgAdjustedSsi ?? 0}
            decimals={1}
            label="Avg adjusted SSI"
            delay={0.5}
          />
          <MegaStat
            value={data.icMemoApproved}
            label="IC memos approved"
            delay={0.6}
          />
        </div>
      </Reveal>

      {/* Funding stage row */}
      <Reveal direction="up" delay={0.5}>
        <div className="mt-14 border-t border-[var(--color-ink)] pt-6">
          <div
            className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Funding stage · Companies DB
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.fundingStages.map((s) => (
              <span
                key={s.stage}
                className="magnetic inline-flex items-baseline gap-2 border border-[var(--color-rule)] bg-white px-3 py-1.5 text-[11px] tracking-[0.04em] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.stage}
                <span
                  className="text-[13px] font-medium text-[var(--color-ink)] tabular-nums"
                >
                  {s.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Body: funnel + histogram */}
      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-12">
        {/* LEFT — Workflow funnel */}
        <div className="md:col-span-7">
          <Reveal direction="up">
            <div className="flex items-baseline justify-between">
              <h3
                className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Workflow funnel · Status field
              </h3>
              <span
                className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Research → Memo
              </span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="mt-6 border-t border-[var(--color-ink)]">
              {data.funnel.map((stage, i) => {
                const width = Math.round((stage.count / maxFunnelCount) * 100);
                return (
                  <FunnelRow
                    key={stage.key}
                    stage={stage}
                    width={width}
                    index={i}
                    highlighted={stage.key === "Memo Written"}
                  />
                );
              })}
            </div>
          </Reveal>

          {/* Discovery sources */}
          <Reveal direction="up" delay={0.2}>
            <div className="mt-12 border-t border-[var(--color-ink)] pt-6">
              <div className="flex items-baseline justify-between">
                <h3
                  className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-ink)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Discovery source · how they entered
                </h3>
                <span
                  className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  9 scanner channels
                </span>
              </div>
              {data.discoverySources.length === 0 ? (
                <p className="mt-4 text-[12px] italic text-[var(--color-ink-mute)]">
                  Discovery sources will fill in as companies are tagged in
                  Notion.
                </p>
              ) : (
                <div className="mt-4">
                  {data.discoverySources.slice(0, 9).map((d, i) => (
                    <DiscoveryBar
                      key={d.key}
                      d={d}
                      max={discoveryMax}
                      isTop={i === 0}
                      delayClass={`bar-fill-${Math.min(5, i + 1)}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* RIGHT — SSI distribution + gates */}
        <div className="md:col-span-5 md:[border-left:0.5px_solid_var(--color-rule)] md:pl-10">
          <Reveal direction="up">
            <div className="flex items-baseline justify-between">
              <h3
                className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Adjusted SSI · 0–100 scale
              </h3>
              <span
                className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-signal)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                P0 ≥ 80
              </span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="mt-6">
              <VerticalBars bands={data.ssiBands} />
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="mt-10 border-t border-[var(--color-ink)] pt-6">
              <SourceConfidencePanel data={data.qualityGates.sourceConfidence} />
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <div className="mt-8 border-t border-[var(--color-ink)] pt-6">
              <QualityGatesPanel data={data.qualityGates} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
