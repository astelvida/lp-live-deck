"use client";

import type { RaisingLikelihood } from "@/lib/types";
import {
  ViewPresetSwitcher,
  type PresetId,
} from "@/components/evidence/ViewPresetSwitcher";

export type ThesisFilter = "All" | "GAO" | "VSor";
export type TierFilter = "P0+P1" | "All tiers";

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`magnetic inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-[0.14em] transition-colors ${
        active
          ? "border-[0.5px] border-[var(--color-signal)] bg-[var(--color-signal)] text-white"
          : "border-[0.5px] border-[var(--color-rule)] bg-white text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
      }`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </button>
  );
}

// Native <select> styled to look intentional inside the brutalist filter bar.
// Native means free keyboard nav + screen reader support — no custom dropdown
// needed for what's effectively a "filter by X" affordance.
function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: readonly T[];
  onChange: (next: T | null) => void;
}) {
  if (options.length === 0) return null;
  return (
    <label
      className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span>{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || null) as T | null)}
        className="border-[0.5px] border-[var(--color-rule)] bg-white px-1.5 py-1 text-[10px] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

const RAISING_OPTIONS: readonly RaisingLikelihood[] = [
  "Active",
  "High",
  "Medium",
  "Low",
];

export function FilterBar({
  visibleCount,
  thesis,
  setThesis,
  tier,
  setTier,
  sector,
  setSector,
  sectorOptions,
  stage,
  setStage,
  stageOptions,
  discovery,
  setDiscovery,
  discoveryOptions,
  raising,
  setRaising,
  preset,
  setPreset,
}: {
  visibleCount: number;
  thesis: ThesisFilter;
  setThesis: (v: ThesisFilter) => void;
  tier: TierFilter;
  setTier: (v: TierFilter) => void;
  sector: string | null;
  setSector: (v: string | null) => void;
  sectorOptions: readonly string[];
  stage: string | null;
  setStage: (v: string | null) => void;
  stageOptions: readonly string[];
  discovery: string | null;
  setDiscovery: (v: string | null) => void;
  discoveryOptions: readonly string[];
  raising: RaisingLikelihood | null;
  setRaising: (v: RaisingLikelihood | null) => void;
  preset: PresetId;
  setPreset: (id: PresetId) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b-[0.5px] border-[var(--color-rule)] bg-[var(--color-paper)] px-5 py-3">
      {/* Left cluster: live count + preset switcher */}
      <div className="flex flex-wrap items-center gap-4">
        <span
          className="kicker inline-flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-signal)]" />
          Live · {visibleCount} visible
        </span>
        <ViewPresetSwitcher value={preset} onChange={setPreset} />
      </div>

      {/* Right cluster: filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Thesis
          </span>
          <FilterChip active={thesis === "All"} onClick={() => setThesis("All")}>
            All
          </FilterChip>
          <FilterChip active={thesis === "GAO"} onClick={() => setThesis("GAO")}>
            GAO
          </FilterChip>
          <FilterChip
            active={thesis === "VSor"}
            onClick={() => setThesis("VSor")}
          >
            VSor
          </FilterChip>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Tier
          </span>
          <FilterChip
            active={tier === "P0+P1"}
            onClick={() => setTier("P0+P1")}
          >
            P0 + P1
          </FilterChip>
          <FilterChip
            active={tier === "All tiers"}
            onClick={() => setTier("All tiers")}
          >
            All
          </FilterChip>
        </div>

        <FilterSelect
          label="Sector"
          value={sector}
          options={sectorOptions}
          onChange={setSector}
        />
        <FilterSelect
          label="Stage"
          value={stage}
          options={stageOptions}
          onChange={setStage}
        />
        <FilterSelect
          label="Source"
          value={discovery}
          options={discoveryOptions}
          onChange={setDiscovery}
        />
        <FilterSelect
          label="Raising"
          value={raising}
          options={RAISING_OPTIONS}
          onChange={setRaising}
        />
      </div>
    </div>
  );
}
