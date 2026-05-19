import type { HeroLatestSignal } from "@/lib/types";

export function LatestSignalCard({ signal }: { signal: HeroLatestSignal | null }) {
  return (
    <div className="rounded border border-[var(--color-rule-on-deep)] px-3 py-3">
      <div
        className="mb-2 text-[8px] uppercase tracking-[0.08em] text-[var(--color-paper-on-deep-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Latest signal
      </div>
      {signal ? (
        <>
          <div className="mb-1 text-[10px] leading-snug text-[var(--color-paper-on-deep)]">
            {signal.title}
            {signal.company ? ` — ${signal.company}` : null}
          </div>
          <div
            className="flex flex-wrap items-center gap-2 text-[8px]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="text-[var(--color-live-green)]">
              {[signal.strength, signal.novelty].filter(Boolean).join(" · ") ||
                "Logged"}
            </span>
            <span className="text-[var(--color-paper-on-deep-mute)]">
              {[signal.week, signal.sourceChannel].filter(Boolean).join(" · ")}
            </span>
          </div>
        </>
      ) : (
        <div className="text-[10px] italic text-[var(--color-paper-on-deep-mute)]">
          No Strong+Escalating signals in the buffer yet.
        </div>
      )}
    </div>
  );
}
