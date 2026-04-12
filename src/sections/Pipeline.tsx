import { SectionHeader } from "@/components/SectionHeader";
import { SSIHistogram } from "@/components/SSIHistogram";
import { CompanyCard } from "@/components/CompanyCard";
import type { PipelineData } from "@/lib/types";

export function PipelineSection({ data }: { data: PipelineData }) {
  const totalScored = data.all.length;
  const tierPct = (n: number) => (totalScored === 0 ? 0 : (n / totalScored) * 100);
  const tiers: Array<{ key: keyof typeof data.byTier; label: string; color: string }> = [
    { key: "HOT", label: "Hot · ≥75", color: "var(--color-hot)" },
    { key: "WARM", label: "Warm · 60–74", color: "var(--color-warm)" },
    { key: "WATCH", label: "Watch · 45–59", color: "var(--color-watch)" },
    { key: "EARLY", label: "Early · <45", color: "var(--color-early)" },
  ];

  const stageOrder = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth"];
  const stages = stageOrder
    .map((s) => ({ stage: s, count: data.byStage[s] ?? 0 }))
    .filter((s) => s.count > 0);
  const stageMax = Math.max(1, ...stages.map((s) => s.count));

  return (
    <section className="mt-32 md:mt-48">
      <SectionHeader
        number="03"
        label="Pipeline"
        kicker={`${totalScored.toLocaleString()} scored companies`}
        title={
          <>
            SSI distribution —{" "}
            <span className="text-display-italic">not a vibe, a rubric.</span>
          </>
        }
      >
        Every company is scored on a v2.0 SSI rubric and assigned a heat tier. Regulatory
        Embeddedness, signal density, and thesis fit all feed the same number.
      </SectionHeader>

      <div className="grid-deck mt-12">
        <div className="col-span-12 md:col-span-10 md:col-start-3">
          <div className="flex h-5 w-full overflow-hidden border border-[var(--color-rule)]">
            {tiers.map((t) => (
              <div
                key={t.key}
                className="h-full"
                style={{ width: `${tierPct(data.byTier[t.key])}%`, background: t.color }}
              />
            ))}
          </div>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {tiers.map((t) => (
              <div key={t.key} className="flex items-baseline gap-3">
                <span
                  className="size-2.5 translate-y-[2px] rounded-full"
                  style={{ background: t.color }}
                />
                <div>
                  <dt
                    className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-ink-mute)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t.label}
                  </dt>
                  <dd
                    className="text-mono-tight text-2xl text-[var(--color-ink)] tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {data.byTier[t.key]}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="grid-deck mt-16">
        <div className="col-span-12 md:col-span-10 md:col-start-3">
          <p
            className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            SSI score distribution · 10-point bins
          </p>
          <SSIHistogram data={data.histogram} />
        </div>
      </div>

      {stages.length > 0 && (
        <div className="grid-deck mt-12">
          <div className="col-span-12 md:col-span-10 md:col-start-3">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Stage distribution
            </p>
            <ul className="flex flex-wrap gap-4">
              {stages.map((s) => (
                <li
                  key={s.stage}
                  className="flex items-end gap-3 border-l border-[var(--color-rule)] pl-3"
                >
                  <span
                    className="block w-10 bg-[var(--color-ink)]"
                    style={{ height: `${8 + (s.count / stageMax) * 48}px` }}
                  />
                  <div>
                    <span
                      className="block text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {s.stage}
                    </span>
                    <span
                      className="text-mono-tight text-xl text-[var(--color-ink)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {s.count}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data.p0p1.length > 0 && (
        <div className="grid-deck mt-20">
          <div className="col-span-12 md:col-span-10 md:col-start-3">
            <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-[var(--color-ink)] pb-3">
              <h3 className="text-display text-2xl md:text-3xl">Action queue · P0 / P1</h3>
              <span
                className="text-[11px] uppercase tracking-[0.26em] text-[var(--color-signal)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {data.p0p1.length} companies — sorted SSI desc
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.p0p1.slice(0, 9).map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
