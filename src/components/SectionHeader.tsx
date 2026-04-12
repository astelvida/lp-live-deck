import type { ReactNode } from "react";

const TOTAL_SECTIONS = 8;

export function SectionHeader({
  number,
  label,
  title,
  kicker,
  children,
}: {
  number: string;
  label: string;
  title: ReactNode;
  kicker?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative border-t border-[var(--color-ink)] pt-10 md:pt-14">
      {/* Top-right running folio */}
      <div className="absolute right-0 top-3 flex items-baseline gap-3">
        <span className="folio hidden sm:inline">
          {label}
        </span>
        <span className="folio-large tabular-nums">
          {number} / {String(TOTAL_SECTIONS).padStart(2, "0")}
        </span>
      </div>

      <div className="grid-deck">
        <div className="col-span-12 md:col-span-2">
          <div
            className="flex items-baseline gap-4 text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="text-display text-[clamp(2rem,3.5vw,2.75rem)] leading-none text-[var(--color-ink)]">
              {number}
            </span>
            <span className="h-px w-8 bg-[var(--color-rule)] md:w-full" />
          </div>
          <p
            className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {label}
          </p>
        </div>
        <div className="col-span-12 md:col-span-10">
          {kicker && (
            <p
              className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-[var(--color-signal)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span aria-hidden="true" className="size-1 rounded-full bg-[var(--color-signal)]" />
              {kicker}
            </p>
          )}
          <h2 className="text-display text-[clamp(2.5rem,6vw,5.5rem)] text-[var(--color-ink)]">
            {title}
          </h2>
          {children && (
            <div className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-ink-soft)] md:text-lg">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
