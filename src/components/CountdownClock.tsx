"use client";

import { useEffect, useState } from "react";

function diff(target: number, now: number) {
  const ms = Math.max(0, target - now);
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { days, hours, minutes, seconds };
}

export function CountdownClock({
  date,
  label,
}: {
  date: string;
  label: string;
}) {
  const targetMs = new Date(date).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds } = diff(targetMs, now);
  const cells: Array<{ v: number; l: string }> = [
    { v: days, l: "days" },
    { v: hours, l: "hours" },
    { v: minutes, l: "mins" },
    { v: seconds, l: "secs" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-signal)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        {cells.map(({ v, l }) => (
          <div key={l} className="flex items-baseline gap-2">
            <span
              className="text-mono-tight text-3xl font-medium text-[var(--color-ink)] tabular-nums md:text-5xl"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {String(v).padStart(2, "0")}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
              {l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
