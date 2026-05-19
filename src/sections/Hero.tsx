import type { HeroData } from "@/lib/types";
import { HeroHeadline } from "@/components/HeroHeadline";
import { LatestSignalCard } from "@/components/LatestSignalCard";
import { Marquee } from "@/components/Marquee";
import { NumberCounter } from "@/components/NumberCounter";
import { Reveal } from "@/components/Reveal";
import { StatTriplet } from "@/components/StatTriplet";

function HeroMetric({
  value,
  decimals,
  suffix,
  label,
  delay,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  delay: number;
}) {
  return (
    <div className="border-t border-[var(--color-rule-on-deep)] pt-3">
      <div
        className="flex items-baseline gap-1 text-[clamp(2rem,3.5vw,2.75rem)] font-medium leading-none tracking-tight text-[var(--color-paper-on-deep)] tabular-nums"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <NumberCounter
          value={value}
          decimals={decimals ?? 0}
          delay={delay}
          duration={1.1}
        />
        {suffix ? (
          <span
            className="text-[14px] text-[var(--color-signal)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {suffix}
          </span>
        ) : null}
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

function ThesisSpread({
  number,
  title,
  description,
  pills,
  companyCount,
  thesisFitCount,
  delay,
}: {
  number: number;
  title: string;
  description: string;
  pills: string[];
  companyCount: number;
  thesisFitCount: number;
  delay: number;
}) {
  return (
    <Reveal delay={delay} direction="up">
      <article className="group relative overflow-hidden border-l-2 border-[var(--color-signal)] bg-[var(--color-ink-deep-soft)] pl-4 pr-4 py-4 transition-colors hover:bg-[oklch(0.13_0_0)]">
        {/* Backdrop numeral */}
        <span
          aria-hidden="true"
          className="backdrop-numeral pointer-events-none absolute -right-2 -top-3 text-[clamp(6rem,11vw,9rem)] text-[var(--color-rule-on-deep)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        >
          0{number}
        </span>
        <div
          className="kicker"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Thesis 0{number}
        </div>
        <h3
          className="mt-2 text-[clamp(1.2rem,1.7vw,1.5rem)] font-medium leading-tight text-[var(--color-paper-on-deep)]"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {title}
        </h3>
        <p className="mt-2 max-w-md text-[12px] leading-relaxed text-[var(--color-paper-on-deep-soft)]">
          {description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pills.slice(0, 4).map((p) => (
            <span
              key={p}
              className="reg-pill border-[0.5px] border-[var(--color-rule-on-deep)] bg-[var(--color-ink-deep)] text-[var(--color-paper-on-deep-soft)]"
            >
              {p}
            </span>
          ))}
        </div>
        <div
          className="mt-3 flex items-baseline gap-3 text-[11px] tabular-nums"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-[var(--color-signal)]">
            <NumberCounter value={companyCount} delay={delay + 0.3} />
            <span className="text-[var(--color-paper-on-deep-mute)]"> co.</span>
          </span>
          <span className="text-[var(--color-rule-on-deep)]">·</span>
          <span className="text-[var(--color-paper-on-deep)]">
            <NumberCounter value={thesisFitCount} delay={delay + 0.4} /> thesis-fit
          </span>
        </div>
      </article>
    </Reveal>
  );
}

function TickerRow({
  count,
  label,
}: {
  count: number;
  label: string;
}) {
  return (
    <span className="flex items-center gap-3 px-5">
      <span
        className="text-[10px] tabular-nums text-[var(--color-signal)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {String(count).padStart(2, "0")}
      </span>
      <span
        className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-paper-on-deep-soft)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="text-[var(--color-rule-on-deep)]"
      >
        ◆
      </span>
    </span>
  );
}

export function Hero({ data }: { data: HeroData }) {
  const avgValue = data.avgAdjustedSsi ?? 0;
  const heroSection = data.theses[0] ?? null;
  const secondThesis = data.theses[1] ?? null;

  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      className="surface-deep relative -mx-6 mb-20 sm:-mx-10"
    >
      {/* Top bar — wordmark + section nav */}
      <div className="ticker-rule border-b border-[var(--color-rule-on-deep)] px-6 py-4 sm:px-10">
        <div className="flex items-center justify-between">
          <span
            className="text-[12px] tracking-[0.08em] text-[var(--color-paper-on-deep)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            anefi.vc <span className="text-[var(--color-signal)]">/</span> pitch
          </span>
          <nav
            aria-label="Section navigation"
            className="hidden gap-6 text-[10px] uppercase tracking-[0.24em] text-[var(--color-paper-on-deep-mute)] md:flex"
          >
            <a className="hover-line transition-colors hover:text-[var(--color-paper-on-deep)]" href="#pipeline">
              02 · Pipeline
            </a>
            <a className="hover-line transition-colors hover:text-[var(--color-paper-on-deep)]" href="#thesis">
              03 · Thesis
            </a>
            <a className="hover-line transition-colors hover:text-[var(--color-paper-on-deep)]" href="#velocity">
              04 · Velocity
            </a>
            <a className="hover-line transition-colors hover:text-[var(--color-paper-on-deep)]" href="#evidence">
              05 · Evidence
            </a>
          </nav>
        </div>
      </div>

      {/* Hero body */}
      <div className="grid grid-cols-1 gap-12 px-6 pb-16 pt-12 md:grid-cols-12 md:px-10 md:pb-20 md:pt-20">
        {/* Left column — the statement */}
        <div className="md:col-span-7">
          <Reveal delay={0.05} duration={0.7} direction="fade">
            <span
              className="kicker"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Fund I · Pre-Seed / Seed · Europe · CEE corridor
            </span>
          </Reveal>

          <div className="mt-7">
            <HeroHeadline />
          </div>

          <Reveal delay={1.05} duration={0.8}>
            <p
              className="mt-8 max-w-xl text-[clamp(1rem,1.3vw,1.18rem)] leading-relaxed text-[var(--color-paper-on-deep-soft)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              A thesis-led fund backing infrastructure-layer AI in regulated
              European markets — before the pattern is obvious. Every company
              tracked, every signal logged, re-renders this site inside a minute.
            </p>
          </Reveal>

          {/* Oversized metrics row */}
          <Reveal delay={1.3} duration={0.6} direction="fade">
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4 md:gap-x-6">
              <HeroMetric
                value={data.companiesTracked}
                suffix="cos"
                label="Companies tracked"
                delay={1.35}
              />
              <HeroMetric
                value={data.signalsLogged}
                suffix="sigs"
                label="Signals logged"
                delay={1.45}
              />
              <HeroMetric
                value={avgValue}
                decimals={1}
                suffix="/100"
                label="Avg adjusted SSI"
                delay={1.55}
              />
              <HeroMetric
                value={data.p0p1Count}
                suffix="cos"
                label="P0 + P1 priority"
                delay={1.65}
              />
            </div>
          </Reveal>

          <Reveal delay={1.85} duration={0.6}>
            <div className="mt-10 max-w-md">
              <StatTriplet
                items={[
                  { value: data.memoReady, label: "Memo approved" },
                  { value: data.outreachActive, label: "Outreach active" },
                  {
                    value: data.escalatingSignals,
                    label: "Escalating sigs",
                    accent: data.escalatingSignals > 0,
                  },
                ]}
              />
            </div>
          </Reveal>
        </div>

        {/* Right column — the bets */}
        <aside className="flex flex-col gap-3 md:col-span-5 md:pl-8 md:[border-left:0.5px_solid_var(--color-rule-on-deep)]">
          <Reveal delay={0.35} duration={0.7}>
            <div
              className="flex items-center justify-between gap-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[var(--color-live-green)]">
                <span className="live-dot inline-block size-1.5 rounded-full bg-[var(--color-live-green)]" />
                LIVE · synced from Notion · ISR 60s
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-paper-on-deep-mute)]">
                Two-Thesis Canon v2.0
              </span>
            </div>
          </Reveal>

          <div
            aria-hidden="true"
            className="my-1 h-px w-full bg-[var(--color-rule-on-deep)]"
          />

          {heroSection ? (
            <ThesisSpread
              number={heroSection.number}
              title={heroSection.title}
              description={heroSection.shortDescription}
              pills={heroSection.regulatoryPills}
              companyCount={heroSection.companyCount}
              thesisFitCount={heroSection.thesisFitCount}
              delay={0.55}
            />
          ) : null}
          {secondThesis ? (
            <ThesisSpread
              number={secondThesis.number}
              title={secondThesis.title}
              description={secondThesis.shortDescription}
              pills={secondThesis.regulatoryPills}
              companyCount={secondThesis.companyCount}
              thesisFitCount={secondThesis.thesisFitCount}
              delay={0.75}
            />
          ) : null}

          <Reveal delay={0.95} duration={0.6}>
            <LatestSignalCard signal={data.latestSignal} />
          </Reveal>
        </aside>
      </div>

      {/* Live ticker — infinite marquee under the hero, sets cadence */}
      <div className="ticker-rule border-y border-[var(--color-rule-on-deep)] py-3">
        <Marquee speedSeconds={45}>
          <TickerRow count={data.companiesTracked} label="Companies tracked" />
          <TickerRow count={data.signalsLogged} label="Signals logged" />
          <TickerRow
            count={data.p0p1Count}
            label="P0 + P1 active outreach"
          />
          <TickerRow
            count={data.escalatingSignals}
            label="Escalating signals"
          />
          <TickerRow count={data.memoReady} label="IC memos approved" />
          <TickerRow count={data.outreachActive} label="Outreach in motion" />
          <TickerRow
            count={Math.round(avgValue * 10) / 10}
            label="Avg adjusted SSI"
          />
        </Marquee>
      </div>

      {/* Scroll hint */}
      <Reveal delay={2.1} duration={0.6} direction="fade">
        <a
          href="#pipeline"
          className="group flex items-center justify-between border-t border-[var(--color-rule-on-deep)] px-6 py-5 text-[10px] uppercase tracking-[0.24em] text-[var(--color-paper-on-deep-mute)] transition-colors hover:text-[var(--color-paper-on-deep)] sm:px-10"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span>02 — The pipeline</span>
          <span className="flex items-center gap-3">
            Scroll <span className="scroll-hint">↓</span>
          </span>
        </a>
      </Reveal>
    </section>
  );
}
