import type { PipelineCompany } from "@/lib/types";
import { HeatBadge } from "./HeatBadge";

export function CompanyCard({ company }: { company: PipelineCompany }) {
  return (
    <article className="group relative flex flex-col gap-4 border border-[var(--color-rule)] bg-[var(--color-paper-deep)]/40 p-5 transition-colors hover:border-[var(--color-ink-mute)]">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-display truncate text-2xl text-[var(--color-ink)]">
            {company.name}
          </h4>
          <p
            className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {company.sector ?? "Sector —"} · {company.stage ?? "Stage —"} ·{" "}
            {company.hq ?? "HQ —"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-mono-tight text-3xl text-[var(--color-ink)] tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {company.ssiScore ?? "—"}
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.24em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            SSI
          </span>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {company.heatTier && <HeatBadge tier={company.heatTier} />}
        {company.priority && (
          <span
            className="border border-[var(--color-signal)]/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[var(--color-signal)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {company.priority} — {company.priority === "P0" ? "Act Now" : "This Week"}
          </span>
        )}
        {company.signalTier && (
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {company.signalTier}
          </span>
        )}
      </div>

      {company.oneLiner && (
        <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">{company.oneLiner}</p>
      )}

      {company.keySignal30d && (
        <p
          className="mt-auto border-t border-[var(--color-rule)] pt-3 text-xs leading-relaxed text-[var(--color-ink-mute)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-[var(--color-signal)]">30d ·</span> {company.keySignal30d}
        </p>
      )}
    </article>
  );
}
