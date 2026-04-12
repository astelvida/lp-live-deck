import type { Thesis } from "@/lib/types";
import { formatSSI } from "@/lib/ssi";
import { ThesisGlyph } from "./ThesisGlyph";
import { CountdownClock } from "./CountdownClock";

export function ThesisCard({ thesis }: { thesis: Thesis }) {
  const catalystFuture =
    thesis.regulatoryCatalystDate &&
    new Date(thesis.regulatoryCatalystDate).getTime() > Date.now();

  const criteria = (thesis.investmentCriteria ?? "")
    .split(/\n|•|·|,(?=\s)/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);

  return (
    <article className="relative border-t border-[var(--color-ink)] pt-10 md:pt-14">
      <div className="grid-deck">
        <div className="col-span-12 md:col-span-2">
          <div className="text-display text-[clamp(3.5rem,7vw,7rem)] text-[var(--color-ink)]">
            {String(thesis.number).padStart(2, "0")}
          </div>
          <div className="mt-4 text-[var(--color-ink-mute)]" aria-hidden="true">
            <ThesisGlyph style={thesis.visualStyle} className="h-32 w-32" />
          </div>
          <p
            className="mt-4 text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Visual Style · {thesis.visualStyle ?? "—"}
          </p>
        </div>

        <div className="col-span-12 md:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            {thesis.category && (
              <span
                className="border border-[var(--color-ink-faint)] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {thesis.category}
              </span>
            )}
            {thesis.conviction && (
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-signal)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Conviction · {thesis.conviction}
              </span>
            )}
          </div>

          <h3 className="text-display mt-4 text-[clamp(2rem,4.5vw,4rem)] text-[var(--color-ink)]">
            {thesis.title}
          </h3>

          {thesis.contrarianHook && (
            <blockquote className="mt-6 border-l-2 border-[var(--color-signal)] pl-5">
              <p className="text-display-italic text-[clamp(1.25rem,2.2vw,1.9rem)] text-[var(--color-ink)]">
                “{thesis.contrarianHook}”
              </p>
            </blockquote>
          )}

          {criteria.length > 0 && (
            <ul className="mt-8 grid gap-2 border-t border-[var(--color-rule)] pt-6 text-sm text-[var(--color-ink-soft)] md:grid-cols-2">
              {criteria.map((c, i) => (
                <li key={i} className="flex items-baseline gap-3">
                  <span
                    className="text-[10px] text-[var(--color-ink-mute)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}

          {thesis.keyRisks && (
            <p className="mt-6 max-w-2xl text-sm text-[var(--color-ink-mute)]">
              <span
                className="mr-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-signal)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Bear case ·
              </span>
              {thesis.keyRisks}
            </p>
          )}
        </div>

        <aside className="col-span-12 flex flex-col gap-6 border-l-0 md:col-span-3 md:border-l md:border-[var(--color-rule)] md:pl-6">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Companies tracked
            </p>
            <p
              className="text-mono-tight text-4xl text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {thesis.companiesTracked.toString().padStart(2, "0")}
            </p>
          </div>
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Strong signals · 90d
            </p>
            <p
              className="text-mono-tight text-2xl text-[var(--color-signal)] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {thesis.strongSignals90d.toString().padStart(2, "0")}
            </p>
          </div>
          {thesis.topCompanies.length > 0 && (
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Top conviction
              </p>
              <ul className="mt-2 space-y-1.5">
                {thesis.topCompanies.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-baseline justify-between gap-3 border-b border-[var(--color-rule)] pb-1.5 last:border-b-0"
                  >
                    <span className="text-sm text-[var(--color-ink)]">{c.name}</span>
                    <span
                      className="text-mono-tight text-xs text-[var(--color-ink-soft)] tabular-nums"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {formatSSI(c.ssiScore)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {thesis.marketSize && (
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Market size
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{thesis.marketSize}</p>
            </div>
          )}
          {catalystFuture && thesis.regulatoryCatalystDate && (
            <CountdownClock
              date={thesis.regulatoryCatalystDate}
              label="Regulatory catalyst"
            />
          )}
        </aside>
      </div>
    </article>
  );
}
