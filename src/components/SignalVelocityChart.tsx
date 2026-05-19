"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { VelocityWeek } from "@/lib/types";

const SIGNAL = "oklch(0.60 0.22 27)";        // #E63312
const GRID = "oklch(0.16 0 0)";              // hairline on dark
const TICK = "oklch(0.45 0 0)";              // muted tick
const TOOLTIP_BG = "oklch(0.10 0 0)";        // #141414

export function SignalVelocityChart({
  data,
  twelveWeekAvg,
}: {
  data: VelocityWeek[];
  twelveWeekAvg: number;
}) {
  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 12, right: 12, bottom: 8, left: 0 }}
        >
          <defs>
            <linearGradient id="velocity-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SIGNAL} stopOpacity={0.18} />
              <stop offset="100%" stopColor={SIGNAL} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke={GRID} vertical={false} />
          <XAxis
            dataKey="week"
            stroke={TICK}
            tick={{
              fill: TICK,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: 0.5,
            }}
            axisLine={{ stroke: GRID }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            stroke={TICK}
            tick={{
              fill: TICK,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
            }}
            axisLine={false}
            tickLine={false}
            width={24}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ stroke: SIGNAL, strokeOpacity: 0.4, strokeWidth: 1 }}
            contentStyle={{
              background: TOOLTIP_BG,
              border: `1px solid ${GRID}`,
              borderRadius: 4,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-paper-on-deep)",
            }}
            labelFormatter={(label) => label}
            formatter={(v: number, name) =>
              name === "total"
                ? [`${v}`, "All signals"]
                : [`${v}`, "Strong only"]
            }
          />
          {twelveWeekAvg > 0 && (
            <ReferenceLine
              y={twelveWeekAvg}
              stroke={TICK}
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
              label={{
                value: `12-wk avg ${twelveWeekAvg.toFixed(1)}`,
                position: "right",
                fill: TICK,
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="total"
            stroke={SIGNAL}
            strokeWidth={1.5}
            fill="url(#velocity-fill)"
            dot={{ r: 2, fill: SIGNAL, stroke: SIGNAL }}
            activeDot={{ r: 3.5 }}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
