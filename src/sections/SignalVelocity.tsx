import { SectionHeader } from "@/components/SectionHeader";
import { SignalVelocityChart } from "@/components/SignalVelocityChart";
import type { SignalVelocityData } from "@/lib/types";

export function SignalVelocitySection({ data }: { data: SignalVelocityData }) {
  const dir = data.deltaPct >= 0 ? "+" : "";
  const maxTypeCount = Math.max(1, ...data.topSignalTypes.map((t) => t.count));

  return (
    <section className="mt-32 md:mt-48">
      <SectionHeader
        number="05"
        label="Velocity"
        kicker={`${data.latestWeekTotal} signals this week`}
        title={
          <>
            Conviction compounds{" "}
            <span className="text-display-italic text-[var(--color-signal)]">weekly.</span>
          </>
        }
      >
        Every signal — funding, senior hires, procurement wins, regulatory filings — is logged
        against the pipeline. The strong-only series shows where attention is converging.
      </SectionHeader>

      <div className="grid-deck mt-12">
        <div className="col-span-12 md:col-span-8 md:col-start-3">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--color-rule)] pb-3">
            <p
              className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Signals per week · trailing {data.weeks.length}w
            </p>
            <div
              className="flex items-baseline gap-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-ink-mute)]">
                vs 4w avg
              </span>
              <span
                className={`text-mono-tight text-2xl ${
                  data.deltaPct >= 0
                    ? "text-[var(--color-signal)]"
                    : "text-[var(--color-ink-soft)]"
                }`}
              >
                {dir}
                {data.deltaPct.toFixed(0)}%
              </span>
            </div>
          </div>
          <SignalVelocityChart data={data.weeks} />
        </div>

        <aside className="col-span-12 md:col-span-2 md:col-start-11">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Latest week
          </p>
          <p
            className="text-mono-tight mt-1 text-5xl text-[var(--color-ink)] tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {data.latestWeekTotal}
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-mute)]">signals</p>
          <p
            className="mt-6 text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            4-week avg
          </p>
          <p
            className="text-mono-tight mt-1 text-2xl text-[var(--color-ink-soft)] tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {data.trailing4wkAvg.toFixed(1)}
          </p>
        </aside>
      </div>

      {data.topSignalTypes.length > 0 && (
        <div className="grid-deck mt-16">
          <div className="col-span-12 md:col-span-10 md:col-start-3">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Top signal types · all time
            </p>
            <ul className="space-y-3">
              {data.topSignalTypes.map((t) => (
                <li key={t.type} className="flex items-center gap-4">
                  <span
                    className="w-40 shrink-0 text-xs uppercase tracking-[0.2em] text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t.type}
                  </span>
                  <span
                    className="h-4 bg-[var(--color-ink)]/85"
                    style={{ width: `${(t.count / maxTypeCount) * 100}%` }}
                  />
                  <span
                    className="text-mono-tight text-sm text-[var(--color-ink-soft)] tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
