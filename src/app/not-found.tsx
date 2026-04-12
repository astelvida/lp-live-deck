import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-[1440px] flex-col justify-center px-6 sm:px-10">
      <p
        className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-signal)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        404
      </p>
      <h1 className="text-display mt-4 text-[clamp(2.5rem,6vw,5rem)] text-[var(--color-ink)]">
        Nothing here.
      </h1>
      <Link
        href="/"
        className="mt-10 inline-flex w-max items-center gap-3 border border-[var(--color-ink)] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Back to the deck →
      </Link>
    </main>
  );
}
