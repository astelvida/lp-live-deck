// Formatters shared by the Evidence table family. Centralized here so the
// table cells, the expanded panel, and the sort comparators agree on rounding
// + currency conventions (we display all funding in € regardless of the
// underlying Notion field name, per the European LP audience — see
// CLAUDE.md note on the Total Funding USD field).

export function formatFundingCompact(amount: number | null): string {
  if (amount === null || amount === undefined) return "—";
  if (amount === 0) return "€0";
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `€${(amount / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `€${Math.round(amount / 1_000)}K`;
  return `€${Math.round(amount)}`;
}

export function formatFollowers(n: number | null): string {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(
  iso: string | null,
  opts?: { withYear?: boolean },
): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    ...(opts?.withYear !== false ? { year: "2-digit" } : {}),
  });
}

export function firstLine(text: string | null): string | null {
  if (!text) return null;
  const line = text.split("\n")[0]?.trim();
  return line || null;
}

export function parseLines(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// Tier badge background used as a sticky-column backdrop so the cell stays
// readable when content scrolls underneath the sticky pin.
export const STICKY_BG = "var(--color-paper)";
