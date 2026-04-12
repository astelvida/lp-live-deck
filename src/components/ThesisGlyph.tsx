import type { VisualStyle } from "@/lib/types";

export function ThesisGlyph({
  style,
  className,
}: {
  style: VisualStyle | null;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <mask id={`fade-${style}`}>
          <rect width="200" height="200" fill="white" />
          <radialGradient id={`rg-${style}`}>
            <stop offset="60%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.2" />
          </radialGradient>
        </mask>
      </defs>
      {style === "Converging" && (
        <g stroke="currentColor" fill="none" strokeWidth="0.8">
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx="100" cy="100" r={8 + i * 7} opacity={1 - i * 0.06} />
          ))}
          <circle cx="100" cy="100" r="4" fill="currentColor" />
        </g>
      )}
      {style === "Expanding" && (
        <g stroke="currentColor" fill="none" strokeWidth="0.8">
          {Array.from({ length: 36 }).map((_, i) => {
            const a = (i / 36) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={100 + Math.cos(a) * 18}
                y1={100 + Math.sin(a) * 18}
                x2={100 + Math.cos(a) * 96}
                y2={100 + Math.sin(a) * 96}
                opacity={0.35 + ((i % 3) * 0.2)}
              />
            );
          })}
          <circle cx="100" cy="100" r="16" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </g>
      )}
      {style === "Fragmenting" && (
        <g fill="currentColor">
          {Array.from({ length: 30 }).map((_, i) => {
            const seed = (i * 9301 + 49297) % 233280;
            const rnd = seed / 233280;
            const a = rnd * Math.PI * 2;
            const r = 20 + ((i * 7) % 70);
            const x = 100 + Math.cos(a) * r;
            const y = 100 + Math.sin(a) * r;
            const s = 2 + ((i * 3) % 6);
            return <rect key={i} x={x} y={y} width={s} height={s} opacity={0.5 + rnd * 0.5} />;
          })}
        </g>
      )}
      {style === "Emerging" && (
        <g fill="currentColor">
          {Array.from({ length: 11 }).map((_, row) =>
            Array.from({ length: 11 }).map((_, col) => {
              const dx = col - 5;
              const dy = row - 5;
              const d = Math.sqrt(dx * dx + dy * dy);
              const r = Math.max(0, 4.5 - d) * 0.9 + 0.4;
              const o = Math.max(0, 1 - d / 5.5);
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={20 + col * 16}
                  cy={20 + row * 16}
                  r={r}
                  opacity={o}
                />
              );
            }),
          )}
        </g>
      )}
      {!style && (
        <g stroke="currentColor" fill="none" strokeWidth="0.6" opacity="0.4">
          <rect x="20" y="20" width="160" height="160" />
          <line x1="20" y1="20" x2="180" y2="180" />
          <line x1="180" y1="20" x2="20" y2="180" />
        </g>
      )}
    </svg>
  );
}
