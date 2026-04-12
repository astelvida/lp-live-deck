import { NumberCounter } from "@/components/NumberCounter";
import type { HeroStats } from "@/lib/types";

export function Hero({ stats }: { stats: HeroStats }) {
  const ticker = [...stats.topPriorityCompanies, ...stats.topPriorityCompanies];
  const year = new Date(stats.generatedAt).getUTCFullYear();

  return (
    <section className="relative overflow-hidden pt-14 pb-24 md:pt-20 md:pb-40">
      {/* Vertical spine — rotated mono label in left gutter */}
      <div
        className="pointer-events-none absolute left-2 top-20 hidden md:block"
        aria-hidden="true"
      >
        <span className="spine-label">
          LP · LIVE DECK · {year} · VOL I
        </span>
      </div>

      {/* Folio pin — top right */}
      <div className="absolute right-0 top-6 hidden items-baseline gap-3 md:flex">
        <span className="folio">Folio</span>
        <span className="folio-large tabular-nums">00 / 07</span>
      </div>

      <div className="grid-deck">
        <div className="col-span-12 md:col-span-2">
          <p
            className="hero-rise hero-rise-1 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            00 · INDEX
          </p>
        </div>
        <div className="col-span-12 md:col-span-10">
          <p
            className="hero-rise hero-rise-1 text-[11px] uppercase tracking-[0.28em] text-[var(--color-signal)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span aria-hidden="true" className="mr-2">※</span>
            Signals Over Stories · LP Deck · {year}
          </p>
          <h1 className="hero-rise hero-rise-2 text-display mt-6 text-[clamp(3.2rem,9vw,8.5rem)] text-[var(--color-ink)]">
            A fund thesis,
            <br />
            <span className="text-display-italic text-[var(--color-signal)]">
              rendered in real time.
            </span>
          </h1>
          <p className="hero-rise hero-rise-3 drop-cap mt-10 max-w-2xl text-lg leading-[1.55] text-[var(--color-ink-soft)] md:text-xl">
            Not a deck. The output of a pitch-generating system. Every company logged, every signal
            surfaced, every thesis updated — this page re-renders within sixty seconds.
          </p>

          {/* Inline provenance strip */}
          <div
            className="hero-rise hero-rise-4 mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>
              Source · <span className="text-[var(--color-ink-soft)]">Notion</span>
            </span>
            <span aria-hidden="true">◇</span>
            <span>
              Rubric · <span className="text-[var(--color-ink-soft)]">SSI v2.0</span>
            </span>
            <span aria-hidden="true">◇</span>
            <span>
              Cadence · <span className="text-[var(--color-ink-soft)]">ISR 60s</span>
            </span>
            <span aria-hidden="true">◇</span>
            <span>
              Audience · <span className="text-[var(--color-ink-soft)]">GP / LP</span>
            </span>
          </div>
        </div>
      </div>

      <div className="hero-rise hero-rise-5 grid-deck mt-24 md:mt-32">
        <Stat
          index={1}
          offset={2}
          label="Companies in Pipeline"
          value={stats.pipelineCount}
          caption="Active — excludes passed deals."
        />
        <Stat
          index={2}
          offset={0}
          label="Signals · Last 7 Days"
          value={stats.signals7d}
          caption="Funding · Hires · Procurement · Regulatory."
        />
        <Stat
          index={3}
          offset={0}
          label="Signals · Last 30 Days"
          value={stats.signals30d}
          caption={`Of ${stats.totalSignals.toLocaleString()} total logged.`}
        />
      </div>

      {stats.topPriorityCompanies.length > 0 && (
        <div
          className="hero-rise hero-rise-5 mt-20 overflow-hidden border-y border-[var(--color-rule)] py-4 md:mt-28"
          aria-label="Top priority companies"
        >
          <div className="marquee flex gap-12 whitespace-nowrap">
            {ticker.map((c, i) => (
              <span
                key={`${c.name}-${i}`}
                className="flex items-baseline gap-3 text-sm tracking-[0.06em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="text-[var(--color-signal)]">●</span>
                <span className="uppercase">{c.name}</span>
                {c.ssiScore !== null && (
                  <span className="text-[var(--color-ink-mute)]">· SSI {c.ssiScore}</span>
                )}
                {c.sector && <span className="text-[var(--color-ink-mute)]">· {c.sector}</span>}
                <span className="ml-8 text-[var(--color-signal)]">P0 — ACT NOW</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scroll hint */}
      <div
        className="mt-16 flex items-center gap-3 text-[var(--color-ink-mute)] md:mt-24"
        aria-hidden="true"
      >
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Continue
        </span>
        <span className="h-px w-14 bg-[var(--color-rule)]" />
        <span
          className="scroll-hint text-[var(--color-signal)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ↓
        </span>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  caption,
  offset,
  index,
}: {
  label: string;
  value: number;
  caption: string;
  offset: number;
  index: number;
}) {
  return (
    <div
      className="relative col-span-12 md:col-span-4"
      style={offset ? { gridColumnStart: offset + 1 } : undefined}
    >
      {/* Thin index rule + stat counter */}
      <div
        className="mb-5 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="tabular-nums">
          {String(index).padStart(2, "0")} / 03
        </span>
        <span className="h-px flex-1 mx-3 bg-[var(--color-rule)]" />
        <span aria-hidden="true" className="text-[var(--color-signal)]">●</span>
      </div>
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
      <NumberCounter
        value={value}
        duration={1}
        delay={0.86}
        className="text-display mt-3 block text-[clamp(4rem,12vw,10rem)] tabular-nums text-[var(--color-ink)]"
      />
      <p className="mt-4 max-w-xs text-sm text-[var(--color-ink-mute)]">{caption}</p>
    </div>
  );
}
