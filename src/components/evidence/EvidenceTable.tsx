"use client";

import { useMemo, useState } from "react";
import type {
  EvidenceCompany,
  RaisingLikelihood,
} from "@/lib/types";
import { EvidenceRow } from "@/components/evidence/EvidenceRow";
import {
  FilterBar,
  type ThesisFilter,
  type TierFilter,
} from "@/components/evidence/FilterBar";
import { SortableTh, type SortDir } from "@/components/evidence/SortableTh";
import type { PresetId } from "@/components/evidence/ViewPresetSwitcher";
import { columnsForPreset, type ColumnKey } from "@/components/evidence/columnModel";
import { firstLine } from "@/components/evidence/utils";

// Enum ordering for sortable enums — keeps "Active > High > Medium > Low" in
// the obvious direction rather than alphabetical.
const RAISING_ORDER: Record<RaisingLikelihood, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Active: 4,
};
const PRIORITY_ORDER: Record<string, number> = { P0: 4, P1: 3, P2: 2, P3: 1 };
const FALSIFIER_ORDER: Record<string, number> = {
  Triggered: 1,
  "Not Run": 2,
  Clean: 3,
};
const ANTI_THESIS_ORDER: Record<string, number> = {
  "Auto-pass": 1,
  "1 Flag": 2,
  "Not Run": 3,
  Clear: 4,
};
const IC_MEMO_ORDER: Record<string, number> = {
  "Not Started": 1,
  Draft: 2,
  "In Review": 3,
  Approved: 4,
  Passed: 5,
};

// Extract the comparable value for a row/column pair. Returns null when the
// row lacks data — null sorts to the bottom regardless of direction so that
// missing data never displaces real signal.
function sortValue(
  c: EvidenceCompany,
  key: ColumnKey,
): number | string | null {
  switch (key) {
    case "company":
      return c.name.toLowerCase();
    case "thesis":
      return c.thesisBadge ?? null;
    case "adjSsi":
      return c.adjustedSsi ?? c.ssiScore ?? null;
    case "tier":
      return c.priority ? (PRIORITY_ORDER[c.priority] ?? null) : null;
    case "sector":
      return c.sector;
    case "stage":
      return c.stage;
    case "status":
      return c.status;
    case "raisingLikelihood":
      return c.raisingLikelihood
        ? (RAISING_ORDER[c.raisingLikelihood] ?? null)
        : null;
    case "idleDays":
      return c.idleDays;
    case "discoverySource":
      return c.discoverySource;
    case "totalFunding":
      return c.totalFundingUsd;
    case "falsifier":
      return c.falsifierCheck
        ? (FALSIFIER_ORDER[c.falsifierCheck] ?? null)
        : null;
    case "antiThesis":
      return c.antiThesisFilter
        ? (ANTI_THESIS_ORDER[c.antiThesisFilter] ?? null)
        : null;
    case "icMemo":
      return c.icMemoStatus ? (IC_MEMO_ORDER[c.icMemoStatus] ?? null) : null;
    case "founders":
      return firstLine(c.founders)?.toLowerCase() ?? null;
    case "customerType":
      return c.customerType;
    case "catalyst":
      return c.catalystWindowDays;
    case "headcountDelta":
      return c.headcount90dDeltaPct;
    case "linkedinDelta":
      return c.linkedinFollowers90dDeltaPct;
    case "sigs":
      return c.signalCount;
    default:
      return null;
  }
}

function compareRows(
  a: EvidenceCompany,
  b: EvidenceCompany,
  key: ColumnKey,
  dir: SortDir,
): number {
  const av = sortValue(a, key);
  const bv = sortValue(b, key);
  if (av === null || av === undefined) return 1;
  if (bv === null || bv === undefined) return -1;
  const sign = dir === "asc" ? 1 : -1;
  if (typeof av === "number" && typeof bv === "number") {
    return (av - bv) * sign;
  }
  return String(av).localeCompare(String(bv)) * sign;
}

export function EvidenceTable({
  companies,
}: {
  companies: EvidenceCompany[];
}) {
  // ─── state ─────────────────────────────────────────────────────────
  const [preset, setPreset] = useState<PresetId>("sourcing");
  const [sortField, setSortField] = useState<ColumnKey>("adjSsi");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [thesis, setThesis] = useState<ThesisFilter>("All");
  const [tier, setTier] = useState<TierFilter>("P0+P1");
  const [sector, setSector] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [discovery, setDiscovery] = useState<string | null>(null);
  const [raising, setRaising] = useState<RaisingLikelihood | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // ─── derived option lists (from the unfiltered data) ──────────────
  const sectorOptions = useMemo(
    () =>
      Array.from(new Set(companies.map((c) => c.sector).filter(Boolean))).sort() as readonly string[],
    [companies],
  );
  const stageOptions = useMemo(
    () =>
      Array.from(
        new Set(companies.map((c) => c.stage).filter(Boolean)),
      ).sort() as readonly string[],
    [companies],
  );
  const discoveryOptions = useMemo(
    () =>
      Array.from(
        new Set(companies.map((c) => c.discoverySource).filter(Boolean)),
      ).sort() as readonly string[],
    [companies],
  );

  // ─── filtering ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (thesis === "GAO") {
        if (
          !c.theses.includes("Governed Agentic Ops") &&
          !c.theses.includes("Both")
        )
          return false;
      } else if (thesis === "VSor") {
        if (
          !c.theses.includes("Vertical SoR AI") &&
          !c.theses.includes("Both")
        )
          return false;
      }
      if (tier === "P0+P1") {
        if (c.priority !== "P0" && c.priority !== "P1") return false;
      }
      if (sector && c.sector !== sector) return false;
      if (stage && c.stage !== stage) return false;
      if (discovery && c.discoverySource !== discovery) return false;
      if (raising && c.raisingLikelihood !== raising) return false;
      return true;
    });
  }, [companies, thesis, tier, sector, stage, discovery, raising]);

  // ─── sorting ──────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    const out = [...filtered];
    out.sort((a, b) => compareRows(a, b, sortField, sortDir));
    return out;
  }, [filtered, sortField, sortDir]);

  // ─── columns derived from preset ──────────────────────────────────
  const columns = useMemo(() => columnsForPreset(preset), [preset]);

  // ─── handlers ─────────────────────────────────────────────────────
  function onSort(field: ColumnKey) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // Sensible default: descending for numerics, ascending for text/enum
      const isNumericLike = [
        "adjSsi",
        "idleDays",
        "totalFunding",
        "catalyst",
        "headcountDelta",
        "linkedinDelta",
        "sigs",
        "tier",
        "raisingLikelihood",
      ].includes(field);
      setSortDir(isNumericLike ? "desc" : "asc");
    }
  }

  function onToggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const hiddenCount = companies.length - sorted.length;

  return (
    <div className="bg-white">
      <FilterBar
        visibleCount={sorted.length}
        thesis={thesis}
        setThesis={setThesis}
        tier={tier}
        setTier={setTier}
        sector={sector}
        setSector={setSector}
        sectorOptions={sectorOptions}
        stage={stage}
        setStage={setStage}
        stageOptions={stageOptions}
        discovery={discovery}
        setDiscovery={setDiscovery}
        discoveryOptions={discoveryOptions}
        raising={raising}
        setRaising={setRaising}
        preset={preset}
        setPreset={setPreset}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((col) =>
                col.sortable ? (
                  <SortableTh
                    key={col.key}
                    field={col.key}
                    currentField={sortField}
                    currentDir={sortDir}
                    onSort={onSort}
                    align={col.align}
                    width={col.width}
                    sticky={
                      col.stickyLeft !== undefined
                        ? { left: col.stickyLeft }
                        : undefined
                    }
                  >
                    {col.label}
                  </SortableTh>
                ) : (
                  <th
                    key={col.key}
                    scope="col"
                    style={{
                      width: col.width,
                      textAlign: col.align ?? "left",
                      ...(col.stickyLeft !== undefined
                        ? {
                            position: "sticky",
                            left: col.stickyLeft,
                            background: "var(--color-paper)",
                            zIndex: 3,
                          }
                        : {}),
                    }}
                    className="border-b-[0.5px] border-[var(--color-rule)] px-3 py-2.5 text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
                  >
                    <span style={{ fontFamily: "var(--font-mono)" }}>
                      {col.label}
                    </span>
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, idx) => (
              <EvidenceRow
                key={c.id}
                company={c}
                columns={columns}
                isExpanded={expanded.has(c.id)}
                onToggle={onToggleExpand}
                highlightP0First={idx === 0 && sortField === "adjSsi"}
              />
            ))}
            {hiddenCount > 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="border-t-[0.5px] border-[var(--color-rule)] px-3 py-3 text-center text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  + {hiddenCount} hidden — adjust filters to show
                </td>
              </tr>
            ) : null}
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="border-t-[0.5px] border-[var(--color-rule)] px-3 py-12 text-center text-[12px] italic text-[var(--color-ink-mute)]"
                >
                  No companies match this filter combination yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
