"use client";

import type { CSSProperties, ReactNode } from "react";

export type SortDir = "asc" | "desc";

// A sortable <th> for the brutalist black header band. The whole header is a
// button so keyboard users get focus + Enter to sort; `aria-sort` is set per
// spec. Active column burns signal-red against the black band.
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
          background: "var(--color-ink)",
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
      className="px-3 py-3 text-[10px] uppercase tracking-[0.16em]"
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex w-full items-center gap-1 transition-colors ${
          active
            ? "text-[var(--color-signal)]"
            : "text-[oklch(0.97_0.012_85_/_0.55)] hover:text-white"
        } ${align === "right" ? "justify-end" : ""}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span>{children}</span>
        <span aria-hidden="true" className="text-[8px] opacity-70">
          {arrow}
        </span>
      </button>
    </th>
  );
}
