"use client";

import { motion, useReducedMotion } from "motion/react";

// Hero headline that reveals word-by-word, with the final word ("consensus.")
// rendered in red italic Fraunces. Choreography is the only ornament — the
// rest of the hero stays still while these three words land.
export function HeroHeadline() {
  const reduced = useReducedMotion();

  const words = ["Signals", "before"];

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.18, delayChildren: 0.15 },
    },
  };

  const word = {
    hidden: { y: "110%", opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  if (reduced) {
    return (
      <h1
        className="text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] text-[var(--color-paper-on-deep)]"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          letterSpacing: "-0.04em",
        }}
      >
        Signals
        <br />
        before
        <br />
        <span
          className="text-[var(--color-signal)]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1',
          }}
        >
          consensus.
        </span>
      </h1>
    );
  }

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className="text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] text-[var(--color-paper-on-deep)]"
      style={{
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        letterSpacing: "-0.04em",
      }}
    >
      {words.map((w) => (
        <span key={w} className="block overflow-hidden">
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
      <span className="block overflow-hidden">
        <motion.span
          variants={word}
          className="inline-block text-[var(--color-signal)]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1',
          }}
        >
          consensus.
        </motion.span>
      </span>
    </motion.h1>
  );
}
