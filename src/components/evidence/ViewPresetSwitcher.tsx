"use client";

export type PresetId = "sourcing" | "ic-prep" | "founders" | "catalyst";

const PRESETS: { id: PresetId; label: string; description: string }[] = [
  {
    id: "sourcing",
    label: "Sourcing",
    description: "Default scout view — discovery, raising likelihood, idle days",
  },
  {
    id: "ic-prep",
    label: "IC Prep",
    description: "Falsifier, anti-thesis, memo state, funding",
  },
  {
    id: "founders",
    label: "Founders",
    description: "Team highlights and customer type",
  },
  {
    id: "catalyst",
    label: "Catalyst",
    description: "Regulatory countdown + traction Δ",
  },
];

export function ViewPresetSwitcher({
  value,
  onChange,
}: {
  value: PresetId;
  onChange: (id: PresetId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="View preset"
      className="inline-flex border-[0.5px] border-[var(--color-ink)]"
    >
      {PRESETS.map((p, i) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={value === p.id}
          title={p.description}
          onClick={() => onChange(p.id)}
          className={`px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-colors ${
            i > 0 ? "border-l-[0.5px] border-[var(--color-rule)]" : ""
          } ${
            value === p.id
              ? "bg-[var(--color-signal)] text-white"
              : "bg-white text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
