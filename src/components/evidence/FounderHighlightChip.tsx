// Lightweight pill for the multi_select "Founder Highlights" Notion field.
// Each known highlight gets its own tone so the row scans as a colored
// signature (e.g. green = exit, blue = top-co alum). Unknown labels fall
// back to a neutral pill so adding a new highlight in Notion doesn't break
// the render — it just shows in neutral until we map a color here.

const HIGHLIGHT_TONE: Record<string, string> = {
  "Prior Exit":
    "bg-[oklch(0.94_0.10_140)] text-[oklch(0.34_0.13_140)]",
  "Top Co Alum":
    "bg-[oklch(0.95_0.06_240)] text-[oklch(0.32_0.13_240)]",
  "Repeat Founder":
    "bg-[oklch(0.95_0.06_290)] text-[oklch(0.40_0.12_290)]",
  "Ex-FAANG/OpenAI/Anthropic":
    "bg-[oklch(0.95_0.06_180)] text-[oklch(0.34_0.10_180)]",
  "Domain PhD":
    "bg-[oklch(0.96_0.04_70)] text-[oklch(0.40_0.13_70)]",
  "Y Combinator":
    "bg-[oklch(0.97_0.07_50)] text-[oklch(0.50_0.16_50)]",
  Techstars: "bg-[oklch(0.97_0.07_320)] text-[oklch(0.45_0.14_320)]",
  "Solo Founder":
    "bg-[var(--color-paper-deep)] text-[var(--color-ink-mute)]",
  "Female Founder":
    "bg-[oklch(0.95_0.07_350)] text-[oklch(0.42_0.16_350)]",
  "Technical Co-founder":
    "bg-[oklch(0.95_0.05_200)] text-[oklch(0.32_0.13_200)]",
};

export function FounderHighlightChip({ label }: { label: string }) {
  const tone =
    HIGHLIGHT_TONE[label] ??
    "bg-[var(--color-paper)] text-[var(--color-ink-mute)] border-[0.5px] border-[var(--color-rule)]";
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[9px] tracking-[0.04em] ${tone}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {label}
    </span>
  );
}
