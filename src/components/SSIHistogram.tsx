"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const INK = "oklch(0.19 0.02 60)";
const INK_MUTE = "oklch(0.19 0.02 60 / 0.45)";
const RULE = "oklch(0.19 0.02 60 / 0.12)";

function barFill(bucket: string): string {
  const start = parseInt(bucket.split("-")[0] ?? "0", 10);
  if (start >= 75) return "oklch(0.60 0.22 27)"; // HOT
  if (start >= 60) return "oklch(0.58 0.12 38)"; // WARM
  if (start >= 45) return "oklch(0.19 0.02 60 / 0.6)"; // WATCH
  return "oklch(0.19 0.02 60 / 0.35)"; // EARLY
}

export function SSIHistogram({
  data,
}: {
  data: Array<{ bucket: string; count: number }>;
}) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 24, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={RULE} vertical={false} />
          <XAxis
            dataKey="bucket"
            stroke={INK_MUTE}
            tick={{ fill: INK_MUTE, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 1 }}
            axisLine={{ stroke: RULE }}
            tickLine={false}
          />
          <YAxis
            stroke={INK_MUTE}
            tick={{ fill: INK_MUTE, fontFamily: "var(--font-mono)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "oklch(0.19 0.02 60 / 0.06)" }}
            contentStyle={{
              background: "oklch(0.96 0.012 85)",
              border: `1px solid ${RULE}`,
              borderRadius: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: INK,
            }}
            labelFormatter={(v) => `SSI ${v}`}
            formatter={(v) => [v, "companies"]}
          />
          <Bar dataKey="count" radius={0} animationDuration={900} animationEasing="ease-out">
            {data.map((d, i) => (
              <RectFill key={i} fill={barFill(d.bucket)} />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              fill={INK}
              fontFamily="var(--font-mono)"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Recharts Cell surrogate — using Bar's itemStyle via Bar fill prop would apply to all bars.
// We use Cell via import:
import { Cell } from "recharts";
function RectFill(props: { fill: string }) {
  return <Cell fill={props.fill} />;
}
