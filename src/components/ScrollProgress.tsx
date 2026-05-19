"use client";

import { motion, useScroll, useSpring } from "motion/react";

// Hairline red progress bar pinned just under the LiveStatusBar — gives the
// pitch a sense of advance. Spring-smoothed so it doesn't jitter.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.25,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed left-0 right-0 top-[34px] z-50 h-[2px] bg-[var(--color-signal)] mix-blend-multiply"
      aria-hidden="true"
    />
  );
}
