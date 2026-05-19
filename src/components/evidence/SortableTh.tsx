"use client";

import type { CSSProperties, ReactNode } from "react";

export type SortDir = "asc" | "desc";

// A sortable <th> with click-to-sort behavior. The whole header is a button
// so keyboard users get focus + Enter to sort. `aria-sort` is set per spec.
// The arrow indicator uses the same red as our other accents when active.
export function SortableTh<F extends string>({
  field,
  currentField,
  currentDir,
  onSort,
  align = "left",
  width,
  sticky,
  children,
}: {
  field: F;
  currentField: F | null;
  currentDir: SortDir;
  onSort: (field: F) => void;
  align?: "left" | "right";
  width?: number | string;
  sticky?: { left: number | string };
  children: ReactNode;
}) {
  const active = currentField === field;
  const arrow = !active ? "↕" : currentDir === "asc" ? "▲" : "▼";

  const cellStyle: CSSProperties = {
    width,
    textAlign: align,
    ...(sticky
      ? {
          position: "sticky",
          left: sticky.left,
          background: "var(--color-paper)",
          zIndex: 3,
        }
      : {}),
  };

  return (
    <th
      scope="col"
      style={cellStyle}
      aria-sort={
        active ? (currentDir === "asc" ? "ascending" : "descending") : "none"
      }
      className="border-b-[0.5px] border-[var(--color-rule)] px-3 py-2.5 text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex w-full items-center gap-1 transition-colors hover:text-[var(--color-ink)] ${
          active ? "text-[var(--color-signal)]" : ""
        } ${align === "right" ? "justify-end" : ""}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span>{children}</span>
        <span aria-hidden="true" className="text-[8px] opacity-60">
          {arrow}
        </span>
      </button>
    </th>
  );
}
