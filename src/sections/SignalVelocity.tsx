import type { SignalVelocityData } from "@/lib/types";
import { NumberCounter } from "@/components/NumberCounter";
import { Reveal } from "@/components/Reveal";
import { SignalVelocityChart } from "@/components/SignalVelocityChart";

function PulseCard({
  value,
  label,
  accent,
  warn,
  delay,
}: {
  value: number;
  label: string;
  accent?: boolean;
  warn?: boolean;
  delay: number;
}) {
  const color = accent
    ? "var(--color-signal)"
    : warn
      ? "var(--color-amber)"
      : "var(--color-paper-on-deep)";
  return (
    <div className="border-t border-[var(--color-rule-on-deep)] pt-3">
      <div
        className="text-[clamp(2rem,4vw,3rem)] font-medium leading-none tabular-nums"
        style={{ fontFamily: "var(--font-mono)", color }}
      >
        <NumberCounter value={value} delay={delay} duration={1.0} />
      </div>
      <div
        className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-paper-on-deep-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
    </div>
  );
}

function TypeBar({
  label,
  count,
  max,
  index,
}: {
  label: string;
  count: number;
  max: number;
  index: number;
}) {
  const width = Math.max(2, Math.round((count / max) * 100));
  return (
    <div className="group grid grid-cols-[140px_1fr_auto] items-center gap-3 border-b border-dashed border-[var(--color-rule-on-deep)] py-2 last:border-b-0">
      <span
        className="truncate text-[11px] uppercase tracking-[0.08em] text-[var(--color-paper-on-deep-soft)] transition-colors group-hover:text-[var(--color-signal)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      <div className="relative h-[8px] overflow-hidden bg-[var(--color-ink-deep-soft)]">
        <span
          className={`absolute inset-y-0 left-0 block bar-fill bar-fill-${Math.min(5, index + 1)}`}
          style={{
            width: `${width}%`,
            background: "var(--color-signal)",
            opacity: 1 - index * 0.07,
          }}
        />
      </div>
      <span
        className="min-w-[32px] text-right text-[12px] font-medium tabular-nums text-[var(--color-paper-on-deep)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {count}
      </span>
    </div>
  );
}

function MicroBar({
  label,
  count,
  max,
  color,
  labelColor,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
  labelColor: string;
}) {
  const width = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div className="grid grid-cols-[78px_1fr_auto] items-center gap-3 py-1.5">
      <span
        className="text-[10px] uppercase tracking-[0.1em]"
        style={{ fontFamily: "var(--font-mono)", color: labelColor }}
      >
        {label}
      </span>
      <div className="relative h-[6px] overflow-hidden bg-[var(--color-ink-deep-soft)]">
        <span
          className="bar-fill absolute inset-y-0 left-0 block"
          style={{ width: `${width}%`, background: color, opacity: 0.8 }}
        />
      </div>
      <span
        className="min-w-[28px] text-right text-[11px] tabular-nums text-[var(--color-paper-on-deep)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {count}
      </span>
    </div>
  );
}

export function SignalVelocitySection({
  data,
}: {
  data: SignalVelocityData;
}) {
  const maxTypeCount = Math.max(
    ...data.topSignalTypes.map((t) => t.count),
    1,
  );
  const maxEvidenceCount = Math.max(
    data.evidenceQuality.primary,
    data.evidenceQuality.secondary,
    data.evidenceQuality.tertiary,
    1,
  );
  const latestWeek = data.weeks[data.weeks.length - 1]?.week ?? "—";

  return (
    <section
      id="velocity"
      aria-labelledby="velocity-title"
      className="surface-deep relative -mx-6 mb-28 scroll-mt-12 sm:-mx-10"
    >
      {/* Top rule + live tag */}
      <div className="ticker-rule flex items-center justify-between border-b border-[var(--color-rule-on-deep)] px-6 py-4 sm:px-10">
        <span
          className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-signal)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          04 / 06 · The heartbeat
        </span>
        <span
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[var(--color-live-green)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="live-dot inline-block size-1.5 rounded-full bg-[var(--color-live-green)]" />
          Live · Signals DB
        </span>
      </div>

      {/* Heading */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-6 px-6 pt-14 sm:px-10">
        <div className="col-span-12 md:col-span-7">
          <Reveal direction="up" duration={0.8}>
            <h2
              id="velocity-title"
              className="display-hero text-[clamp(2.5rem,5.5vw,4.5rem)] text-[var(--color-paper-on-deep)]"
            >
              Signal velocity,{" "}
              <span className="display-wonk text-[var(--color-signal)]">
                cadence over claims.
              </span>
            </h2>
          </Reveal>
        </div>
        <div className="col-span-12 md:col-span-5">
          <Reveal direction="up" delay={0.15}>
            <p
              className="pullquote text-[clamp(1rem,1.5vw,1.25rem)] text-[var(--color-paper-on-deep-soft)]"
            >
              We don&apos;t pitch a vibe. We log signals, score them, and only
              speak when the cadence is real.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Big chart */}
      <div className="px-6 pb-2 pt-10 sm:px-10">
        <div className="flex items-baseline justify-between">
          <h3
            className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-paper-on-deep)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Signals per week · last 12
          </h3>
          <span
            className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-paper-on-deep-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            W##-YYYY format · ISO week
          </span>
        </div>
        <Reveal direction="up" delay={0.15}>
          <div className="mt-4 border-t border-[var(--color-rule-on-deep)] pt-4">
            <SignalVelocityChart
              data={data.weeks}
              twelveWeekAvg={data.twelveWeekAvg}
            />
          </div>
        </Reveal>
      </div>

      {/* This week + types row */}
      <div className="grid grid-cols-1 gap-y-10 px-6 pb-12 pt-12 sm:px-10 md:grid-cols-12 md:gap-x-10">
        <div className="md:col-span-5">
          <Reveal direction="up">
            <div className="flex items-baseline justify-between">
              <h3
                className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-paper-on-deep)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                This week&apos;s pulse
              </h3>
              <span
                className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-signal)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {latestWeek}
              </span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="mt-6 grid grid-cols-3 gap-x-6">
              <PulseCard
                value={data.thisWeek.total}
                label="Total signals"
                delay={0.2}
              />
              <PulseCard
                value={data.thisWeek.strong}
                label="Strong"
                accent={data.thisWeek.strong > 0}
                delay={0.3}
              />
              <PulseCard
                value={data.thisWeek.escalating}
                label="Escalating"
                warn={data.thisWeek.escalating > 0}
                delay={0.4}
              />
            </div>
          </Reveal>

          {/* Novelty */}
          <Reveal direction="up" delay={0.2}>
            <div className="mt-10 border-t border-[var(--color-rule-on-deep)] pt-6">
              <h4
                className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper-on-deep)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Novelty
              </h4>
              <div className="mt-3 grid grid-cols-3 gap-x-6">
                <PulseCard
                  value={data.noveltyBreakdown.new}
                  label="New"
                  delay={0.35}
                />
                <PulseCard
                  value={data.noveltyBreakdown.repeated}
                  label="Repeated"
                  delay={0.45}
                />
                <PulseCard
                  value={data.noveltyBreakdown.escalating}
                  label="Escalating"
                  accent={data.noveltyBreakdown.escalating > 0}
                  delay={0.55}
                />
              </div>
            </div>
          </Reveal>

          {/* Evidence quality */}
          <Reveal direction="up" delay={0.25}>
            <div className="mt-10 border-t border-[var(--color-rule-on-deep)] pt-6">
              <h4
                className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper-on-deep)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Evidence quality
              </h4>
              <div className="mt-3">
                <MicroBar
                  label="Primary"
                  count={data.evidenceQuality.primary}
                  max={maxEvidenceCount}
                  color="var(--color-live-green)"
                  labelColor="var(--color-live-green)"
                />
                <MicroBar
                  label="Secondary"
                  count={data.evidenceQuality.secondary}
                  max={maxEvidenceCount}
                  color="var(--color-amber)"
                  labelColor="var(--color-amber)"
                />
                <MicroBar
                  label="Tertiary"
                  count={data.evidenceQuality.tertiary}
                  max={maxEvidenceCount}
                  color="var(--color-paper-on-deep-mute)"
                  labelColor="var(--color-paper-on-deep-mute)"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-7 md:[border-left:0.5px_solid_var(--color-rule-on-deep)] md:pl-10">
          <Reveal direction="up">
            <div className="flex items-baseline justify-between">
              <h3
                className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-paper-on-deep)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Signal type breakdown
              </h3>
              <span
                className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-paper-on-deep-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Top {data.topSignalTypes.length}
                {data.otherSignalCount > 0 ? " + others" : ""}
              </span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="mt-4 border-t border-[var(--color-rule-on-deep)]">
              {data.topSignalTypes.length === 0 ? (
                <p className="mt-4 text-[12px] italic text-[var(--color-paper-on-deep-mute)]">
                  No signals logged yet.
                </p>
              ) : (
                data.topSignalTypes.map((t, i) => (
                  <TypeBar
                    key={t.type}
                    label={t.type}
                    count={t.count}
                    max={maxTypeCount}
                    index={i}
                  />
                ))
              )}
              {data.otherSignalCount > 0 ? (
                <TypeBar
                  label="+ other types"
                  count={data.otherSignalCount}
                  max={maxTypeCount}
                  index={data.topSignalTypes.length}
                />
              ) : null}
            </div>
          </Reveal>

          {/* Bottom counters: thesis breakdown / disqualifying / memo candidates */}
          <Reveal direction="up" delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[var(--color-rule-on-deep)] pt-6">
              <div>
                <div
                  className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-paper-on-deep-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  By thesis
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-[var(--color-paper-on-deep-soft)]">
                    <span>GAO</span>
                    <span
                      className="tabular-nums text-[var(--color-paper-on-deep)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {data.byThesisRelevance["Governed Agentic Ops"]}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[var(--color-paper-on-deep-soft)]">
                    <span>VSor</span>
                    <span
                      className="tabular-nums text-[var(--color-paper-on-deep)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {data.byThesisRelevance["Vertical SoR AI"]}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[var(--color-paper-on-deep-mute)]">
                    <span>Both</span>
                    <span
                      className="tabular-nums"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {data.byThesisRelevance.both}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-paper-on-deep-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Disqualifying
                </div>
                <div
                  className={`mt-2 text-[clamp(2rem,4vw,2.75rem)] font-medium leading-none tabular-nums ${
                    data.disqualifying > 0
                      ? "text-[var(--color-signal)]"
                      : "text-[var(--color-paper-on-deep-mute)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <NumberCounter value={data.disqualifying} delay={0.3} />
                </div>
                <div
                  className="mt-1 text-[9px] text-[var(--color-paper-on-deep-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Falsifier triggers
                </div>
              </div>
              <div>
                <div
                  className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-paper-on-deep-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Memo candidates
                </div>
                <div
                  className={`mt-2 text-[clamp(2rem,4vw,2.75rem)] font-medium leading-none tabular-nums ${
                    data.memoCandidates > 0
                      ? "text-[var(--color-signal)]"
                      : "text-[var(--color-paper-on-deep-mute)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <NumberCounter value={data.memoCandidates} delay={0.45} />
                </div>
                <div
                  className="mt-1 text-[9px] text-[var(--color-paper-on-deep-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Memo Candidate = true
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
