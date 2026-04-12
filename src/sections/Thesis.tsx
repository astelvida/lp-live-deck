import { SectionHeader } from "@/components/SectionHeader";
import { ThesisCard } from "@/components/ThesisCard";
import type { Thesis } from "@/lib/types";

export function ThesisSection({ theses }: { theses: Thesis[] }) {
  return (
    <section className="mt-24 md:mt-40">
      <SectionHeader
        number="02"
        label="Thesis"
        kicker="Three bets · one operating system"
        title={
          <>
            What we believe,{" "}
            <span className="text-display-italic text-[var(--color-signal)]">
              and what kills it.
            </span>
          </>
        }
      >
        Each thesis ships with a contrarian hook, an explicit investment criteria checklist, and a
        regulatory catalyst date. If the catalyst moves, the page moves.
      </SectionHeader>

      {theses.length === 0 ? (
        <div className="grid-deck mt-12">
          <p className="col-span-12 text-[var(--color-ink-mute)] md:col-start-3 md:col-span-10">
            No published theses available. Check back after the next Notion sync.
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-20 md:space-y-28">
          {theses.map((t) => (
            <ThesisCard key={t.id} thesis={t} />
          ))}
        </div>
      )}
    </section>
  );
}
