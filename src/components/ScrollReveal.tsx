"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function ScrollReveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "header" | "li" | "span";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const initial = reduced ? { opacity: 1 } : { opacity: 0, y };
  const whileInView = { opacity: 1, y: 0 };
  return (
    <Tag
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}
