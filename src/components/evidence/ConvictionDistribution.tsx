"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { useReducedMotion } from "motion/react";
import type { EvidenceCompany } from "@/lib/types";

// Live adjusted-SSI distribution of whatever rows are currently visible. Unlike
// the static pipeline histogram, this one is fed by the filtered set — it
// re-animates every time the thesis / tier / sector filters or a preset
// changes, so the shape of the conviction set is always legible at a glance.

const BUCKETS: { lo: number; hi: number }[] = [
  { lo: 35, hi: 45 },
  { lo: 45, hi: 55 },
  { lo: 55, hi: 65 },
  { lo: 65, hi: 75 },
  { lo: 75, hi: 85 },
  { lo: 85, hi: 101 },
];

// Bucket fill by the priority band its range sits in — P3 recedes to ink,
// P0 burns signal-red. Presentational only; band logic stays in ssi.ts.
const BUCKET_COLOR = [
  "var(--color-ink-faint)",
  "var(--color-ink-mute)",
  "var(--color-ink-mute)",
  "var(--color-clay)",
  "var(--color-clay)",
  "var(--color-signal)",
];

export function ConvictionDistribution({
  companies,
}: {
  companies: EvidenceCompany[];
}) {
  const reduced = useReducedMotion();

  const data = BUCKETS.map((b, i) => ({
    label: String(b.lo),
    color: BUCKET_COLOR[i],
    count: companies.filter((c) => {
      const s = c.adjustedSsi ?? c.ssiScore;
      return s != null && s >= b.lo && s < b.hi;
    }).length,
  }));

  const scored = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex items-stretch gap-5 border-b-[0.5px] border-[var(--color-rule)] bg-[var(--color-paper)] px-5 py-3">
      <div className="flex shrink-0 flex-col justify-center">
        <span
          className="text-[9px] uppercase tracking-[0.22em] text-[var(--color-signal)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Visible conviction
        </span>
        <span
          className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {scored} scored · adjusted SSI
        </span>
      </div>
      <div className="h-[64px] min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 14, right: 4, bottom: 0, left: 4 }}
            barCategoryGap="22%"
          >
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "var(--color-rule)" }}
              tick={{
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                fill: "var(--color-ink-mute)",
              }}
              interval={0}
            />
            <Bar
              dataKey="count"
              isAnimationActive={!reduced}
              animationDuration={620}
              animationEasing="ease-out"
              radius={[1, 1, 0, 0]}
            >
              <LabelList
                dataKey="count"
                position="top"
                formatter={(v: number) => (v > 0 ? String(v) : "")}
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  fill: "var(--color-ink)",
                  fontWeight: 600,
                }}
              />
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
