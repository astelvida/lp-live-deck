interface StatTripletItem {
  value: number | string;
  label: string;
  accent?: boolean;
}

export function StatTriplet({ items }: { items: StatTripletItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded border border-[var(--color-rule-on-deep)] bg-[var(--color-ink-deep-soft)] px-2 py-2"
        >
          <div
            className="text-[13px] font-medium leading-none tabular-nums"
            style={{
              fontFamily: "var(--font-mono)",
              color: item.accent
                ? "var(--color-signal)"
                : "var(--color-paper-on-deep)",
            }}
          >
            {item.value}
          </div>
          <div
            className="mt-1 text-[8px] uppercase tracking-[0.06em] text-[var(--color-paper-on-deep-mute)]"
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
