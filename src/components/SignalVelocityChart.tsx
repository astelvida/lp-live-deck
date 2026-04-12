"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { VelocityWeek } from "@/lib/types";

const INK = "oklch(0.19 0.02 60)";
const INK_MUTE = "oklch(0.19 0.02 60 / 0.45)";
const RULE = "oklch(0.19 0.02 60 / 0.12)";
const SIGNAL = "oklch(0.60 0.22 27)";

export function SignalVelocityChart({ data }: { data: VelocityWeek[] }) {
  const formatted = data.map((w) => ({
    ...w,
    label: w.week.replace(/^\d{4}-/, ""),
  }));
  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer>
        <LineChart data={formatted} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={RULE} vertical={false} />
          <XAxis
            dataKey="label"
            stroke={INK_MUTE}
            tick={{ fill: INK_MUTE, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1 }}
            axisLine={{ stroke: RULE }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            stroke={INK_MUTE}
            tick={{ fill: INK_MUTE, fontFamily: "var(--font-mono)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={28}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.96 0.012 85)",
              border: `1px solid ${RULE}`,
              borderRadius: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: INK,
            }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.week ?? ""}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke={INK}
            strokeWidth={1.5}
            dot={{ r: 2.5, fill: INK, stroke: INK }}
            activeDot={{ r: 4 }}
            animationDuration={900}
            animationEasing="ease-out"
            name="All signals"
          />
          <Line
            type="monotone"
            dataKey="strong"
            stroke={SIGNAL}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ r: 2, fill: SIGNAL, stroke: SIGNAL }}
            activeDot={{ r: 4 }}
            animationDuration={1100}
            animationEasing="ease-out"
            name="Strong only"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
