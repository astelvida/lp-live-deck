"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page error]", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[80dvh] w-full max-w-[1440px] flex-col justify-center px-6 sm:px-10">
      <p
        className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-signal)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Live deck — temporarily unreadable
      </p>
      <h1 className="text-display mt-4 text-[clamp(2.5rem,6vw,5rem)] text-[var(--color-ink)]">
        The feed is briefly offline.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
        The Notion integration isn&rsquo;t responding. This page refreshes every sixty seconds — odds
        are it&rsquo;s back by the time you reload.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-10 inline-flex w-max items-center gap-3 border border-[var(--color-ink)] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Retry now →
      </button>
    </main>
  );
}
