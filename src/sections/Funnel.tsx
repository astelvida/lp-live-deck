import { SectionHeader } from "@/components/SectionHeader";
import type { FunnelData } from "@/lib/types";

export function FunnelSection({ data }: { data: FunnelData }) {
  const { stages, totalScreened, totalPassed, passReasons, killCriteriaSamples } = data;
  const maxStage = Math.max(1, ...stages.map((s) => s.count));
  const maxReason = Math.max(1, ...passReasons.map((r) => r.count));
  const survivalRate =
    totalScreened === 0 ? 0 : ((totalScreened - totalPassed) / totalScreened) * 100;

  return (
    <section className="mt-32 md:mt-48">
      <SectionHeader
        number="04"
        label="Discipline"
        kicker={`${totalPassed} passed of ${totalScreened} screened`}
        title={
          <>
            Pass discipline —{" "}
            <span className="text-display-italic">receipts, not claims.</span>
          </>
        }
      >
        Every screened company has a codified reason to stay or go. No vibe-passes. The
        funnel below shows where the pipeline narrows, and the bars below show the exact
        reasons companies leave.
      </SectionHeader>

      <div className="grid-deck mt-12">
        <div className="col-span-12 md:col-span-10 md:col-start-3">
          <p
            className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Funnel · top-down conviction filter
          </p>
          <ol className="space-y-3">
            {stages.map((s, i) => {
              const pct = (s.count / maxStage) * 100;
              const prevStage = i > 0 ? stages[i - 1] : undefined;
              const prev = prevStage?.count ?? null;
              const drop =
                prev && prev > 0 ? ((prev - s.count) / prev) * 100 : null;
              const isPassed = s.key === "Passed";
              return (
                <li key={s.key} className="flex items-center gap-4">
                  <span
                    className="w-24 shrink-0 text-[10px] uppercase tracking-[0.24em] text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="h-6"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      background: isPassed
                        ? "var(--color-signal)"
                        : "var(--color-ink)",
                      opacity: isPassed ? 0.85 : 1,
                    }}
                  />
                  <span
                    className="text-mono-tight text-xl text-[var(--color-ink)] tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {s.count}
                  </span>
                  {drop !== null && drop > 0 && (
                    <span
                      className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)] tabular-nums"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      −{drop.toFixed(0)}%
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="grid-deck mt-20">
        <div className="col-span-12 md:col-span-7 md:col-start-3">
          <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-[var(--color-ink)] pb-3">
            <h3 className="text-display text-2xl md:text-3xl">Why we pass</h3>
            <span
              className="text-[11px] uppercase tracking-[0.26em] text-[var(--color-signal)] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {passReasons.length} codified categories
            </span>
          </div>
          {passReasons.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-mute)]">
              No passes logged yet. Pass reasons will appear as the pipeline is worked.
            </p>
          ) : (
            <ul className="space-y-3">
              {passReasons.map((r) => (
                <li key={r.reason} className="flex items-center gap-4">
                  <span
                    className="w-48 shrink-0 text-xs uppercase tracking-[0.2em] text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {r.reason}
                  </span>
                  <span
                    className="h-4 bg-[var(--color-ink)]/85"
                    style={{ width: `${(r.count / maxReason) * 100}%` }}
                  />
                  <span
                    className="text-mono-tight text-sm text-[var(--color-ink-soft)] tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {r.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="col-span-12 md:col-span-3 md:col-start-10">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Survival rate
          </p>
          <p
            className="text-mono-tight mt-1 text-5xl text-[var(--color-ink)] tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {survivalRate.toFixed(0)}%
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-mute)]">
            of screened companies still in pipeline
          </p>
          {killCriteriaSamples.length > 0 && (
            <>
              <p
                className="mt-8 text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Kill criteria · live samples
              </p>
              <ul className="mt-3 space-y-3 border-l border-[var(--color-ink)] pl-4">
                {killCriteriaSamples.map((k, i) => (
                  <li
                    key={i}
                    className="text-display-italic text-sm leading-snug text-[var(--color-ink-soft)]"
                  >
                    “{k}”
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
