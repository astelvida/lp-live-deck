import type { Priority } from "@/lib/types";

// `Idle Days` is a Notion formula that returns the days since the row was last
// edited. Days alone aren't a problem — but a P0/P1 sitting idle >14d means
// the scout pipeline has stalled. We surface that as a red dot + count.
// Non-warning rows still show the count in mute so the column reads cleanly.

export function IdleBadge({
  days,
  priority,
}: {
  days: number | null;
  priority: Priority | null;
}) {
  if (days === null || days === undefined) {
    return (
      <span
        className="text-[10px] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        —
      </span>
    );
  }
  const isWarning =
    (priority === "P0" || priority === "P1") && days > 14;
  if (isWarning) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] tabular-nums text-[var(--color-signal)]"
        style={{ fontFamily: "var(--font-mono)" }}
        title={`Stale ${days} days — P0/P1 should not idle`}
      >
        <span className="size-1 rounded-full bg-[var(--color-signal)]" />
        {days}d
      </span>
    );
  }
  return (
    <span
      className="text-[10px] tabular-nums text-[var(--color-ink-mute)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {days}d
    </span>
  );
}
