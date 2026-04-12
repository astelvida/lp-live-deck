"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getHeatColor, getHeatTier } from "@/lib/ssi";

export function SSIGauge({
  score,
  size = 160,
  stroke = 3,
}: {
  score: number;
  size?: number;
  stroke?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(reduced ? score : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) return setProgress(score);
    const controls = animate(0, score, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setProgress(v),
    });
    return () => controls.stop();
  }, [inView, score, reduced]);

  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - progress / 100);
  const tier = getHeatTier(score);
  const color = getHeatColor(tier);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`SSI score ${score}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-rule)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="butt"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="var(--color-ink)"
        style={{ fontFamily: "var(--font-mono)", fontSize: size * 0.3, letterSpacing: "-0.04em" }}
      >
        {Math.round(progress)}
      </text>
      <text
        x="50%"
        y={size - stroke * 6}
        textAnchor="middle"
        fill="var(--color-ink-mute)"
        style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em" }}
      >
        SSI
      </text>
    </svg>
  );
}
