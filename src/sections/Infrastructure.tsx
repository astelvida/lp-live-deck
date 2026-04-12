import { SectionHeader } from "@/components/SectionHeader";
import type { InfraCounts, ScoutingChannelCount, ScoutingData } from "@/lib/types";

const NODES = [
  { key: "Scouting", label: "Scouting Engine", sub: "regscan · ghscan · procscan · talentscan" },
  { key: "Signal Log", label: "Signal Log", sub: "Funding · Hires · Procurement · Regulatory" },
  { key: "Dealflow", label: "Dealflow DB", sub: "SSI · Heat Tier · Thesis · Priority" },
  { key: "SSI", label: "SSI Scoring v2.0", sub: "two rubrics · one pipeline" },
  { key: "This page", label: "This page", sub: "ISR · revalidate 60s" },
];

function ChannelList({
  title,
  rows,
  limit = 6,
}: {
  title: string;
  rows: ScoutingChannelCount[];
  limit?: number;
}) {
  const visible = rows.slice(0, limit);
  const max = Math.max(1, ...visible.map((r) => r.count));
  return (
    <div>
      <p
        className="mb-3 text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {title}
      </p>
      {visible.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-mute)]">—</p>
      ) : (
        <ul className="space-y-2">
          {visible.map((r) => (
            <li key={r.key} className="flex items-center gap-3">
              <span
                className="w-28 shrink-0 text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {r.label}
              </span>
              <span
                className="h-3 bg-[var(--color-ink)]/80"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
              <span
                className="text-mono-tight text-xs text-[var(--color-ink-soft)] tabular-nums"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {r.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function InfrastructureSection({
  counts,
  scouting,
}: {
  counts: InfraCounts;
  scouting: ScoutingData;
}) {
  const cells = [
    { label: "Companies", value: counts.companies },
    { label: "Signals", value: counts.signals },
    { label: "Theses", value: counts.theses },
    { label: "Posts", value: counts.posts },
  ];

  return (
    <section className="mt-32 md:mt-48">
      <SectionHeader
        number="07"
        label="Infrastructure"
        kicker="The meta section"
        title={
          <>
            This isn&rsquo;t a pitch deck.{" "}
            <span className="text-display-italic">It&rsquo;s the output of one.</span>
          </>
        }
      >
        Notion is the source of truth. Clay and the scanning workflows feed signals in. The SSI
        Scoring Methodology v2.0 is the rubric. Every 60 seconds, this page re-renders with whatever
        state the DBs are in.
      </SectionHeader>

      <div className="grid-deck mt-14">
        <div className="col-span-12 md:col-span-10 md:col-start-3">
          <ol
            className="grid gap-0 border-t border-b border-[var(--color-ink)] md:grid-cols-5"
            role="list"
          >
            {NODES.map((n, i) => (
              <li
                key={n.key}
                className="relative flex flex-col justify-between gap-4 border-[var(--color-rule)] p-5 md:border-l"
                style={{ borderLeftWidth: i === 0 ? 0 : undefined }}
              >
                <span
                  className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-signal)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Node {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-display text-xl text-[var(--color-ink)]">{n.label}</p>
                  <p
                    className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {n.sub}
                  </p>
                </div>
                {i < NODES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-[-6px] top-1/2 hidden -translate-y-1/2 text-[var(--color-signal)] md:block"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid-deck mt-14">
        <div className="col-span-12 md:col-span-10 md:col-start-3">
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-[var(--color-ink)] pb-3">
            <h3 className="text-display text-2xl md:text-3xl">Scouting engine · live</h3>
            <span
              className="text-[11px] uppercase tracking-[0.26em] text-[var(--color-signal)] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {scouting.totalSignals} signals · {scouting.conversionRate.toFixed(0)}% actioned
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <ChannelList
              title="Discovery source · companies"
              rows={scouting.discoverySources}
            />
            <ChannelList
              title="Evidence integrity · signals"
              rows={scouting.evidenceTypes}
            />
            <ChannelList
              title="Action taken · signals"
              rows={scouting.actions}
            />
          </div>
        </div>
      </div>

      <div className="grid-deck mt-10">
        <div className="col-span-12 md:col-span-10 md:col-start-3">
          <dl className="grid gap-6 border-t border-[var(--color-rule)] pt-8 sm:grid-cols-2 md:grid-cols-4">
            {cells.map((c) => (
              <div key={c.label}>
                <dt
                  className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.label} · live
                </dt>
                <dd
                  className="text-mono-tight mt-1 text-4xl text-[var(--color-ink)] tabular-nums"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.value.toLocaleString()}
                </dd>
              </div>
            ))}
          </dl>
          <p
            className="mt-8 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Last DB write · {new Date(counts.lastWriteAt).toISOString().replace("T", " ").slice(0, 19)} UTC
          </p>
        </div>
      </div>
    </section>
  );
}
