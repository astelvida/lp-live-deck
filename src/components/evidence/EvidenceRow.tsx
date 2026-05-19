"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { EvidenceCompany } from "@/lib/types";
import { formatAdjustedSSI } from "@/lib/ssi";
import { CatalystCountdown } from "@/components/evidence/CatalystCountdown";
import { ExpandedRowPanel } from "@/components/evidence/ExpandedRowPanel";
import { FounderHighlightChip } from "@/components/evidence/FounderHighlightChip";
import { IdleBadge } from "@/components/evidence/IdleBadge";
import { RaisingLikelihoodPill } from "@/components/evidence/RaisingLikelihoodPill";
import { TrendArrow } from "@/components/evidence/TrendArrow";
import {
  firstLine,
  formatFundingCompact,
} from "@/components/evidence/utils";
import type { Column } from "@/components/evidence/columnModel";

// Color tokens reused from the previous table — kept as inline maps so a
// designer reading this file sees the full vocabulary at once.
const THESIS_BADGE_CLS: Record<string, string> = {
  "Governed Agentic Ops":
    "bg-[oklch(0.95_0.03_240)] text-[oklch(0.32_0.13_240)] border-[0.5px] border-[oklch(0.84_0.08_240)]",
  "Vertical SoR AI":
    "bg-[oklch(0.95_0.06_130)] text-[oklch(0.34_0.13_130)] border-[0.5px] border-[oklch(0.80_0.11_130)]",
  Both: "bg-[oklch(0.94_0.05_290)] text-[oklch(0.40_0.12_290)] border-[0.5px] border-[oklch(0.84_0.07_290)]",
};
const THESIS_BADGE_LABEL: Record<string, string> = {
  "Governed Agentic Ops": "GAO",
  "Vertical SoR AI": "Vert. SoR",
  Both: "Both",
};

const PRIORITY_BADGE: Record<string, string> = {
  P0: "bg-[var(--color-signal-soft)] text-[var(--color-signal)] border-[0.5px] border-[var(--color-signal)]",
  P1: "bg-[oklch(0.97_0.05_70)] text-[oklch(0.45_0.13_70)] border-[0.5px] border-[var(--color-amber)]",
  P2: "bg-[var(--color-paper)] text-[var(--color-ink-mute)] border-[0.5px] border-[var(--color-rule)]",
  P3: "bg-[var(--color-paper)] text-[var(--color-ink-mute)] border-[0.5px] border-[var(--color-rule)]",
};

const MEMO_BADGE: Record<string, string> = {
  Approved: "bg-[oklch(0.94_0.10_140)] text-[oklch(0.34_0.13_140)]",
  Draft: "bg-[oklch(0.97_0.06_70)] text-[oklch(0.45_0.13_70)]",
  "In Review": "bg-[oklch(0.97_0.06_70)] text-[oklch(0.45_0.13_70)]",
  Passed: "bg-[var(--color-paper-deep)] text-[var(--color-ink-mute)]",
  "Not Started": "bg-[var(--color-paper-deep)] text-[var(--color-ink-mute)]",
};

const FALSIFIER_BADGE: Record<string, string> = {
  Clean: "bg-[oklch(0.94_0.10_140)] text-[oklch(0.34_0.13_140)]",
  Triggered: "bg-[var(--color-signal-soft)] text-[var(--color-signal)]",
  "Not Run": "bg-[var(--color-paper-deep)] text-[var(--color-ink-mute)]",
};

const ANTI_THESIS_BADGE: Record<string, string> = {
  Clear: "bg-[oklch(0.94_0.10_140)] text-[oklch(0.34_0.13_140)]",
  "1 Flag": "bg-[oklch(0.97_0.06_70)] text-[oklch(0.45_0.13_70)]",
  "Auto-pass": "bg-[var(--color-signal-soft)] text-[var(--color-signal)]",
  "Not Run": "bg-[var(--color-paper-deep)] text-[var(--color-ink-mute)]",
};

function MutedDash() {
  return (
    <span
      className="text-[10px] text-[var(--color-ink-mute)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      —
    </span>
  );
}

function Cell({
  col,
  company,
  isP0,
  isSelected,
}: {
  col: Column;
  company: EvidenceCompany;
  isP0: boolean;
  isSelected: boolean;
}) {
  // One cell renderer per column key. Keeps row markup linear; column
  // definitions stay pure-data. Sticky background is applied on the <td>
  // itself (below) so we don't have to thread it into every cell here.
  switch (col.key) {
    case "company": {
      // Includes the red left-border slide as a P0/selected/hover indicator.
      const accentCls = isSelected
        ? "bg-[var(--color-signal)]"
        : isP0
          ? "bg-[var(--color-signal)] opacity-100"
          : "bg-[var(--color-signal)] opacity-0 group-hover:opacity-100";
      return (
        <>
          <span
            aria-hidden="true"
            className={`absolute inset-y-0 left-0 w-[3px] transition-opacity duration-200 ${accentCls}`}
          />
          <span
            className={`ml-2 truncate text-[12px] ${
              isP0 || isSelected ? "font-medium" : ""
            } ${
              isSelected
                ? "text-[var(--color-signal)]"
                : "text-[var(--color-ink)]"
            }`}
          >
            {company.name}
          </span>
        </>
      );
    }
    case "thesis": {
      const k = company.thesisBadge ?? "";
      const cls = k ? THESIS_BADGE_CLS[k] : null;
      const label = k ? THESIS_BADGE_LABEL[k] : null;
      if (!cls || !label) return <MutedDash />;
      return (
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-[9px] tracking-[0.08em] ${cls}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </span>
      );
    }
    case "adjSsi": {
      const value = company.adjustedSsi ?? company.ssiScore ?? 0;
      return (
        <div className="flex items-center gap-2">
          <div className="relative h-[5px] flex-1 overflow-hidden bg-[var(--color-paper-deep)]">
            <span
              className="absolute inset-y-0 left-0 block"
              style={{
                width: `${Math.min(100, value)}%`,
                background: "var(--color-signal)",
              }}
            />
          </div>
          <span
            className={`min-w-[36px] text-right text-[11px] tabular-nums ${
              isP0 ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]"
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {formatAdjustedSSI(company.adjustedSsi ?? company.ssiScore)}
          </span>
        </div>
      );
    }
    case "tier": {
      if (!company.priority) return <MutedDash />;
      return (
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-[9px] tracking-[0.08em] ${PRIORITY_BADGE[company.priority]}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {company.priority}
        </span>
      );
    }
    case "sector":
      return company.sector ? (
        <span
          className="truncate text-[11px] text-[var(--color-ink-soft)]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {company.sector}
        </span>
      ) : (
        <MutedDash />
      );
    case "stage":
      return company.stage ? (
        <span
          className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-soft)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {company.stage}
        </span>
      ) : (
        <MutedDash />
      );
    case "status":
      return company.status ? (
        <span
          className="truncate text-[11px] text-[var(--color-ink-soft)]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {company.status}
        </span>
      ) : (
        <MutedDash />
      );
    case "raisingLikelihood":
      return <RaisingLikelihoodPill value={company.raisingLikelihood} />;
    case "idleDays":
      return (
        <IdleBadge days={company.idleDays} priority={company.priority} />
      );
    case "discoverySource":
      return company.discoverySource ? (
        <span
          className="text-[10px] tracking-[0.06em] text-[var(--color-ink-soft)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {company.discoverySource}
        </span>
      ) : (
        <MutedDash />
      );
    case "totalFunding":
      return (
        <span
          className="text-[11px] tabular-nums text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {formatFundingCompact(company.totalFundingUsd)}
        </span>
      );
    case "falsifier": {
      const v = company.falsifierCheck ?? "Not Run";
      return (
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-[9px] tracking-[0.08em] ${FALSIFIER_BADGE[v]}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {v}
        </span>
      );
    }
    case "antiThesis": {
      const v = company.antiThesisFilter ?? "Not Run";
      return (
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-[9px] tracking-[0.08em] ${ANTI_THESIS_BADGE[v]}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {v}
        </span>
      );
    }
    case "icMemo": {
      const v = company.icMemoStatus ?? "Not Started";
      return (
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-[9px] tracking-[0.08em] ${MEMO_BADGE[v]}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {v}
        </span>
      );
    }
    case "founders": {
      const name = firstLine(company.founders);
      return name ? (
        <span
          className="truncate text-[11px] text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-sans)" }}
          title={company.founders ?? undefined}
        >
          {name}
        </span>
      ) : (
        <MutedDash />
      );
    }
    case "founderHighlights": {
      if (company.founderHighlights.length === 0) return <MutedDash />;
      const visible = company.founderHighlights.slice(0, 2);
      const overflow = company.founderHighlights.length - visible.length;
      return (
        <div className="flex flex-wrap items-center gap-1">
          {visible.map((h) => (
            <FounderHighlightChip key={h} label={h} />
          ))}
          {overflow > 0 ? (
            <span
              className="text-[9px] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
              title={company.founderHighlights.slice(2).join(" · ")}
            >
              +{overflow}
            </span>
          ) : null}
        </div>
      );
    }
    case "customerType":
      return company.customerType ? (
        <span
          className="inline-block rounded border-[0.5px] border-[var(--color-rule)] bg-white px-1.5 py-0.5 text-[9px] tracking-[0.08em] text-[var(--color-ink-soft)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {company.customerType}
        </span>
      ) : (
        <MutedDash />
      );
    case "catalyst":
      return <CatalystCountdown days={company.catalystWindowDays} />;
    case "headcountDelta":
      return <TrendArrow value={company.headcount90dDeltaPct} />;
    case "linkedinDelta":
      return <TrendArrow value={company.linkedinFollowers90dDeltaPct} />;
    case "sigs":
      return (
        <span
          className={`text-[11px] tabular-nums ${
            isP0 ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {company.signalCount}
        </span>
      );
    case "expand":
      // The expand chevron itself is rendered by EvidenceRow on the <button>
      // wrapping the cell — keep the cell empty so the chevron sits flush.
      return null;
    default:
      return <MutedDash />;
  }
}

export function EvidenceRow({
  company,
  columns,
  isExpanded,
  onToggle,
  highlightP0First,
}: {
  company: EvidenceCompany;
  columns: readonly Column[];
  isExpanded: boolean;
  onToggle: (id: string) => void;
  highlightP0First: boolean;
}) {
  const reduced = useReducedMotion();
  const isP0 = company.priority === "P0";
  const rowBgCls = isExpanded
    ? "bg-[var(--color-signal-soft)]"
    : highlightP0First && isP0
      ? "bg-[oklch(0.98_0.025_27)]"
      : "hover:bg-[var(--color-paper)]";
  const colSpan = columns.length;
  return (
    <>
      <tr
        className={`group cursor-pointer border-t-[0.5px] border-[var(--color-rule)] transition-colors ${rowBgCls}`}
        onClick={() => onToggle(company.id)}
        aria-expanded={isExpanded}
      >
        {columns.map((col) => {
          const stickyStyle: CSSProperties = {
            width: col.width,
            textAlign: col.align ?? "left",
            ...(col.stickyLeft !== undefined
              ? {
                  position: "sticky",
                  left: col.stickyLeft,
                  zIndex: 1,
                  background: isExpanded
                    ? "var(--color-signal-soft)"
                    : highlightP0First && isP0
                      ? "oklch(0.98 0.025 27)"
                      : "white",
                }
              : {}),
          };
          if (col.key === "expand") {
            return (
              <td
                key={col.key}
                style={stickyStyle}
                className="px-2 py-2 text-right"
              >
                <button
                  type="button"
                  aria-label={
                    isExpanded ? "Collapse row" : "Expand row"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(company.id);
                  }}
                  className={`inline-flex size-5 items-center justify-center rounded text-[12px] transition-transform ${
                    isExpanded
                      ? "rotate-90 text-[var(--color-signal)]"
                      : "text-[var(--color-ink-mute)] group-hover:text-[var(--color-ink)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ▸
                </button>
              </td>
            );
          }
          return (
            <td
              key={col.key}
              style={stickyStyle}
              className={`${col.key === "company" ? "relative" : ""} px-3 py-2`}
            >
              <Cell
                col={col}
                company={company}
                isP0={isP0}
                isSelected={isExpanded}
              />
            </td>
          );
        })}
      </tr>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.tr
            key="expanded"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <td colSpan={colSpan} className="p-0">
              <motion.div
                initial={reduced ? false : { height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <ExpandedRowPanel company={company} />
              </motion.div>
            </td>
          </motion.tr>
        ) : null}
      </AnimatePresence>
    </>
  );
}
