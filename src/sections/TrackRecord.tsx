import { SectionHeader } from "@/components/SectionHeader";
import { SSIGauge } from "@/components/SSIGauge";
import type { PipelineCompany } from "@/lib/types";

export function TrackRecordSection({ companies }: { companies: PipelineCompany[] }) {
  return (
    <section className="mt-32 md:mt-48">
      <SectionHeader
        number="06"
        label="Conviction"
        kicker="Top 5 by SSI · in active dialogue"
        title={
          <>
            Where we&rsquo;re{" "}
            <span className="text-display-italic text-[var(--color-signal)]">putting time.</span>
          </>
        }
      >
        Outreach sent, calls scheduled, memos drafted. Passed companies are excluded — this is live
        conviction, not a leaderboard of things we looked at.
      </SectionHeader>

      {companies.length === 0 ? (
        <div className="grid-deck mt-10">
          <p className="col-span-12 text-[var(--color-ink-mute)] md:col-start-3 md:col-span-10">
            No active-dialogue companies yet.
          </p>
        </div>
      ) : (
        <div className="grid-deck mt-12">
          <ul className="col-span-12 grid gap-12 sm:grid-cols-2 md:col-span-10 md:col-start-3 md:grid-cols-5">
            {companies.map((c) => (
              <li key={c.id} className="group flex flex-col items-center text-center">
                {c.ssiScore !== null && <SSIGauge score={c.ssiScore} />}
                <p className="text-display mt-4 text-lg leading-tight text-[var(--color-ink)]">
                  {c.name}
                </p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.sector ?? "Sector —"}
                </p>
                {c.theses[0] && (
                  <p
                    className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[var(--color-signal)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {c.theses[0]}
                  </p>
                )}
                {c.regulatoryEmbeddedness !== null && (
                  <p
                    className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    RegEmbed {c.regulatoryEmbeddedness}/20
                  </p>
                )}
                {c.oneLiner && (
                  <p className="mt-3 max-w-[18ch] text-xs leading-relaxed text-[var(--color-ink-soft)] opacity-0 transition-opacity group-hover:opacity-100">
                    {c.oneLiner}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
