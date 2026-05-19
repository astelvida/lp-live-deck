"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "fade";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  fade: { x: 0, y: 0 },
};

// Single-shot scroll reveal. Use sparingly — the design wants choreography,
// not a wave of fades on every element.
//
// `amount` is forwarded to motion's useInView. Use the string "some" (default)
// so any single intersecting pixel triggers — a numeric ratio (e.g. 0.3) can
// never be reached when the wrapped element is taller than viewportHeight/ratio
// (~3000px on a 900px viewport at 0.3), leaving the wrapper stuck at opacity 0.
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  amount = "some",
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number | "some" | "all";
  className?: string;
  as?: "div" | "section" | "article" | "p" | "h2" | "h3" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount });
  const offset = OFFSET[direction];

  const Motion = motion[Tag] as typeof motion.div;

  return (
    <Motion
      ref={ref}
      initial={reduced ? false : { opacity: 0, x: offset.x, y: offset.y }}
      animate={
        reduced
          ? undefined
          : inView
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 0, x: offset.x, y: offset.y }
      }
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </Motion>
  );
}
