import type { EvidenceData } from "@/lib/types";
import { EvidenceTable } from "@/components/evidence/EvidenceTable";
import { Reveal } from "@/components/Reveal";
// NOTE: Reveal is still used above for the section heading. Do NOT wrap the
// EvidenceTable below — see comment near the table for the useInView ratio
// failure mode that made the table invisible.

export function EvidenceSection({ data }: { data: EvidenceData }) {
  const totalActive = data.companies.length;
  const p0Count = data.companies.filter((c) => c.priority === "P0").length;
  const p1Count = data.companies.filter((c) => c.priority === "P1").length;

  return (
    <section
      id="evidence"
      aria-labelledby="evidence-title"
      className="relative mb-28 scroll-mt-12"
    >
      {/* Section heading */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 md:col-span-2">
          <span
            className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-signal)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            05 / 06
          </span>
          <p
            className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            The Conviction List
          </p>
        </div>
        <div className="col-span-12 md:col-span-10">
          <Reveal direction="up" duration={0.8}>
            <h2
              id="evidence-title"
              className="display-hero text-[clamp(2.5rem,5.5vw,4.5rem)] text-[var(--color-ink)]"
            >
              Top conviction,{" "}
              <span className="display-wonk text-[var(--color-signal)]">
                sorted by adjusted SSI.
              </span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <p
              className="pullquote mt-6 max-w-2xl text-[clamp(1.05rem,1.6vw,1.4rem)] text-[var(--color-ink-soft)]"
            >
              {totalActive} active in the buffer. {p0Count} P0 · {p1Count} P1.
              Switch presets — Sourcing, IC Prep, Founders, Catalyst — and
              click any row to expand founders, funding, and traction.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Interactive table — NOT wrapped in <Reveal/> because the table is
          ~4000px tall and Motion's useInView({ amount: 0.3 }) ratio can never
          be reached on a 900px viewport, leaving the wrapper stuck at opacity 0.
          The header above already animates; the table renders directly. */}
      <div className="mt-14 border-2 border-[var(--color-ink)]">
        <EvidenceTable companies={data.companies} />
      </div>
    </section>
  );
}
