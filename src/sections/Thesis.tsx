import { ThesisCard } from "@/components/ThesisCard";
import { Reveal } from "@/components/Reveal";
import type { Thesis } from "@/lib/types";

export function ThesisSection({ theses }: { theses: Thesis[] }) {
  return (
    <section
      id="thesis"
      aria-labelledby="thesis-title"
      className="relative mb-28 scroll-mt-12"
    >
      {/* Section heading row */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 md:col-span-2">
          <span
            className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-signal)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            03 / 06
          </span>
          <p
            className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            The Two Bets
          </p>
        </div>
        <div className="col-span-12 md:col-span-10">
          <Reveal direction="up" duration={0.8}>
            <h2
              id="thesis-title"
              className="display-hero text-[clamp(2.5rem,5.5vw,4.5rem)] text-[var(--color-ink)]"
            >
              Two theses,{" "}
              <span className="display-wonk text-[var(--color-signal)]">
                one moat each.
              </span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <p
              className="pullquote mt-6 max-w-2xl text-[clamp(1.05rem,1.6vw,1.4rem)] text-[var(--color-ink-soft)]"
            >
              Horizontal AI is commoditising. We underwrite two structural moats
              in regulated Europe: the deployment gateway, and the system of
              record.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Two-thesis spread — full-bleed feel */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2">
        {theses.map((t, i) => (
          <div
            key={t.key}
            className={
              i === 0
                ? "md:[border-right:0.5px_solid_var(--color-ink)]"
                : ""
            }
          >
            <ThesisCard thesis={t} align={i === 0 ? "left" : "right"} />
          </div>
        ))}
      </div>
    </section>
  );
}
