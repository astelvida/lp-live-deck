"use client";

import { useEffect, useState } from "react";

const REVALIDATE_SECONDS = 60;

function fmtAgo(seconds: number): string {
  if (seconds < 1) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

export function LiveStatusBar({ generatedAt }: { generatedAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  const generatedMs = new Date(generatedAt).getTime();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const agoSec = Math.max(0, Math.floor((now - generatedMs) / 1000));
  const cycleSec = agoSec % REVALIDATE_SECONDS;
  const nextSec = Math.max(0, REVALIDATE_SECONDS - cycleSec);
  const progress = cycleSec / REVALIDATE_SECONDS; // 0 → 1 across the window

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[var(--color-paper)]/88 backdrop-blur-sm"
    >
      <div
        className="flex items-center justify-between px-6 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)] sm:px-10"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="live-dot inline-block size-1.5 rounded-full bg-[var(--color-live)]"
          />
          <span className="font-medium tracking-[0.24em]">LIVE</span>
          <span className="hidden text-[var(--color-ink-mute)] sm:inline">
            · data refreshed {fmtAgo(agoSec)}
          </span>
        </div>

        <div className="hidden items-center gap-3 md:flex" aria-hidden="true">
          <span className="text-[var(--color-ink-mute)]">NOTION</span>
          <span className="h-px w-6 bg-[var(--color-rule)]" />
          <span className="text-[var(--color-ink-mute)]">ISR 60s</span>
          <span className="h-px w-6 bg-[var(--color-rule)]" />
          <span className="text-[var(--color-ink-mute)]">EDGE</span>
          <span className="h-px w-6 bg-[var(--color-rule)]" />
          <span className="text-[var(--color-signal)]">LP-LIVE-DECK</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden tabular-nums text-[var(--color-ink-mute)] sm:inline">
            next sync {String(nextSec).padStart(2, "0")}s
          </span>
          <span className="tabular-nums text-[var(--color-ink-soft)]">
            T+{String(Math.min(99, Math.floor(agoSec / 60))).padStart(2, "0")}:
            {String(agoSec % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Countdown sweep — 1px bar that refills across the 60s window */}
      <div
        className="relative h-px w-full overflow-hidden bg-[var(--color-rule)]"
        aria-hidden="true"
      >
        <span
          className="absolute inset-0 block h-full origin-left bg-[var(--color-signal)]"
          style={{ transform: `scaleX(${progress})`, transition: "transform 1s linear" }}
        />
      </div>
    </div>
  );
}
