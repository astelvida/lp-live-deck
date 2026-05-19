import {
  GRR_BENCHMARK,
  REGULATORY_CATALYSTS,
  type ThesisKey,
} from "@/lib/thesis-canon";
import type { Thesis } from "@/lib/types";
import { NumberCounter } from "@/components/NumberCounter";
import { Reveal } from "@/components/Reveal";

const CATALYST_COLOR: Record<"live" | "approaching" | "future", string> = {
  live: "var(--color-signal)",
  approaching: "var(--color-amber)",
  future: "var(--color-ink-mute)",
};

const CATALYST_LABEL: Record<"live" | "approaching" | "future", string> = {
  live: "LIVE",
  approaching: "APPROACHING",
  future: "BUILDING",
};

function EvidenceBullet({
  bullet,
  index,
}: {
  bullet: Thesis["evidence"][number];
  index: number;
}) {
  return (
    <Reveal direction="up" delay={index * 0.08}>
      <li className="group relative grid grid-cols-[80px_1fr] gap-4 border-b border-dashed border-[var(--color-rule)] py-3 transition-colors hover:bg-[oklch(0.97_0.012_85_/_0.55)]">
        <span
          className={`pt-0.5 text-[10px] uppercase tracking-[0.12em] tabular-nums ${
            bullet.isFresh
              ? "text-[var(--color-signal)]"
              : "text-[var(--color-ink-mute)]"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {bullet.week ?? "—"}
        </span>
        <div className="min-w-0">
          <p
            className={`text-[13px] leading-snug ${
              bullet.isFresh
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-ink-soft)]"
            }`}
          >
            {bullet.title}
          </p>
          <div
            className="mt-1 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {bullet.sourceChannel ? <span>{bullet.sourceChannel}</span> : null}
            {bullet.signalType ? <span>· {bullet.signalType}</span> : null}
            {bullet.novelty ? (
              <span
                className={
                  bullet.novelty === "Escalating"
                    ? "text-[var(--color-signal)]"
                    : ""
                }
              >
                · {bullet.novelty}
              </span>
            ) : null}
          </div>
        </div>
      </li>
    </Reveal>
  );
}

function CatalystRow({
  catalyst,
}: {
  catalyst: (typeof REGULATORY_CATALYSTS)[number];
}) {
  return (
    <div className="grid grid-cols-[14px_1fr_auto] items-baseline gap-3 border-b border-dashed border-[var(--color-rule)] py-2 last:border-b-0">
      <span
        className="block size-[7px] translate-y-1 rounded-full"
        style={{ background: CATALYST_COLOR[catalyst.status] }}
        aria-hidden="true"
      />
      <span className="text-[12px] text-[var(--color-ink-soft)]">
        {catalyst.label}
      </span>
      <div
        className="flex items-baseline gap-2 text-[10px] uppercase tracking-[0.14em] tabular-nums"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span style={{ color: CATALYST_COLOR[catalyst.status] }}>
          {catalyst.date}
        </span>
        <span
          className="text-[8px]"
          style={{ color: CATALYST_COLOR[catalyst.status] }}
        >
          · {CATALYST_LABEL[catalyst.status]}
        </span>
      </div>
    </div>
  );
}

export function ThesisCard({
  thesis,
  align,
}: {
  thesis: Thesis;
  align: "left" | "right";
}) {
  const isGAO = thesis.key === "Governed Agentic Ops";
  const isRight = align === "right";

  return (
    <article
      className={`relative overflow-hidden border-t border-[var(--color-ink)] bg-[var(--color-paper)] px-6 py-10 sm:px-10 ${
        isRight ? "md:border-l-0" : ""
      } md:py-12`}
    >
      {/* Backdrop numeral — sits behind the content */}
      <span
        aria-hidden="true"
        className={`backdrop-numeral pointer-events-none absolute -top-12 text-[clamp(14rem,22vw,22rem)] text-[var(--color-ink-faint)] ${
          isRight ? "right-2" : "right-4"
        }`}
      >
        0{thesis.number}
      </span>

      {/* Thesis label */}
      <Reveal direction="up">
        <div
          className="relative z-10 flex items-baseline justify-between gap-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="kicker">Thesis 0{thesis.number}</span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
            {thesis.shortTitle}
          </span>
        </div>
      </Reveal>

      {/* Thesis title */}
      <Reveal direction="up" delay={0.05}>
        <h3
          className="relative z-10 mt-4 display-hero text-[clamp(2rem,4vw,3rem)] text-[var(--color-ink)]"
        >
          {thesis.title}
        </h3>
      </Reveal>

      {/* Core Bet pull-quote */}
      <Reveal direction="up" delay={0.1}>
        <blockquote
          className="pullquote relative z-10 mt-6 max-w-xl text-[clamp(1.05rem,1.5vw,1.3rem)] text-[var(--color-ink-soft)]"
        >
          {thesis.coreBet}
        </blockquote>
      </Reveal>

      {/* Anti-thesis stamp */}
      <Reveal direction="up" delay={0.15}>
        <div className="relative z-10 mt-5 flex items-start gap-3 border-l-2 border-[var(--color-signal)] bg-[var(--color-signal-soft)] py-2 pl-3 pr-4">
          <span
            className="shrink-0 text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--color-signal)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            We reject ·
          </span>
          <span className="text-[11px] leading-snug text-[var(--color-ink-soft)]">
            {thesis.antiThesis}
          </span>
        </div>
      </Reveal>

      {/* Regulatory pills */}
      <Reveal direction="up" delay={0.2}>
        <div className="relative z-10 mt-6 flex flex-wrap gap-1.5">
          {thesis.regulatoryPills.map((p) => (
            <span
              key={p}
              className="reg-pill border-[0.5px] border-[var(--color-signal)] bg-white text-[var(--color-signal)]"
              style={{ fontSize: "10px", padding: "3px 8px" }}
            >
              {p}
            </span>
          ))}
        </div>
      </Reveal>

      {/* Stats line */}
      <Reveal direction="up" delay={0.25}>
        <div className="relative z-10 mt-8 grid grid-cols-3 gap-6 border-y border-[var(--color-ink)] py-5">
          <div>
            <div
              className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-none text-[var(--color-ink)] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <NumberCounter value={thesis.totalCompanies} delay={0.3} />
            </div>
            <div
              className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Companies
            </div>
          </div>
          <div>
            <div
              className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-none text-[var(--color-signal)] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <NumberCounter value={thesis.thesisFitCount} delay={0.4} />
            </div>
            <div
              className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              P0+P1 fit
            </div>
          </div>
          <div>
            <div
              className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-none text-[var(--color-ink)] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <NumberCounter value={thesis.strongSignals90d} delay={0.5} />
            </div>
            <div
              className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Strong sigs · 90d
            </div>
          </div>
        </div>
      </Reveal>

      {/* Live evidence */}
      <div className="relative z-10 mt-8">
        <Reveal direction="up">
          <div className="flex items-baseline justify-between">
            <h4
              className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Live evidence
            </h4>
            <span
              className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Strong + Escalating
            </span>
          </div>
        </Reveal>
        {thesis.evidence.length === 0 ? (
          <p className="mt-4 text-[12px] italic text-[var(--color-ink-mute)]">
            No Strong+Escalating signals tagged to this thesis in the buffer.
          </p>
        ) : (
          <ul className="mt-2">
            {thesis.evidence.map((b, i) => (
              <EvidenceBullet key={b.id} bullet={b} index={i} />
            ))}
          </ul>
        )}
      </div>

      {/* Company chips */}
      <div className="relative z-10 mt-8">
        <Reveal direction="up">
          <div className="flex items-baseline justify-between">
            <h4
              className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Conviction roster
            </h4>
            <span
              className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {thesis.totalCompanies} total · sorted by Adj. SSI
            </span>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {thesis.companies.map((c) => {
              const isP0 = c.priority === "P0";
              const isP1 = c.priority === "P1";
              return (
                <span
                  key={c.id}
                  className={`magnetic inline-flex items-center gap-2 px-2.5 py-1.5 text-[11px] tracking-[0.02em] ${
                    isP0
                      ? "border-[1.5px] border-[var(--color-signal)] bg-[var(--color-signal-soft)] text-[var(--color-signal)]"
                      : isP1
                        ? "border-[0.5px] border-[var(--color-amber)] bg-white text-[var(--color-ink)]"
                        : "border-[0.5px] border-[var(--color-rule)] bg-white text-[var(--color-ink-soft)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.name}
                  {(c.adjustedSsi ?? c.ssiScore) !== null ? (
                    <span
                      className="rounded-sm px-1 text-[9px] tabular-nums"
                      style={{
                        background: isP0
                          ? "var(--color-signal-soft)"
                          : "var(--color-paper-deep)",
                        color: isP0
                          ? "var(--color-signal)"
                          : "var(--color-ink-soft)",
                      }}
                    >
                      {Math.round(c.adjustedSsi ?? c.ssiScore ?? 0)}
                    </span>
                  ) : null}
                </span>
              );
            })}
            {thesis.totalCompanies > thesis.companies.length ? (
              <span
                className="inline-flex items-center px-2.5 py-1.5 text-[11px] uppercase tracking-[0.06em] text-[var(--color-ink-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                + {thesis.totalCompanies - thesis.companies.length} more
              </span>
            ) : null}
          </div>
        </Reveal>
      </div>

      {/* Per-thesis special block */}
      <Reveal direction="up" delay={0.2}>
        {isGAO ? (
          <div className="relative z-10 mt-8 border border-[var(--color-ink)] bg-white px-5 py-5">
            <div
              className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-signal)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Regulatory catalyst window
            </div>
            <div className="mt-3">
              {REGULATORY_CATALYSTS.map((c) => (
                <CatalystRow key={c.label} catalyst={c} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative z-10 mt-8 border border-[var(--color-ink)] bg-white px-5 py-5">
            <div
              className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-signal)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              GRR benchmark · the moat test
            </div>
            <div className="mt-3">
              <div className="flex items-baseline justify-between border-b border-dashed border-[var(--color-rule)] py-2">
                <span className="text-[12px] text-[var(--color-ink-soft)]">
                  {GRR_BENCHMARK.embedded.label}
                </span>
                <span
                  className="text-[14px] font-medium tabular-nums text-[var(--color-live)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {GRR_BENCHMARK.embedded.value}
                </span>
              </div>
              <div className="flex items-baseline justify-between py-2">
                <span className="text-[12px] text-[var(--color-ink-soft)]">
                  {GRR_BENCHMARK.overlay.label}
                </span>
                <span
                  className="text-[14px] font-medium tabular-nums text-[var(--color-signal)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {GRR_BENCHMARK.overlay.value}
                </span>
              </div>
              <p className="mt-2 border-t border-dashed border-[var(--color-rule)] pt-2 text-[10px] italic leading-relaxed text-[var(--color-ink-mute)]">
                {GRR_BENCHMARK.test}
              </p>
            </div>
          </div>
        )}
      </Reveal>
    </article>
  );
}

export type { ThesisKey };
