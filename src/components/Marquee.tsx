import type { ReactNode } from "react";

// Infinite CSS marquee — duplicates children once so the loop is seamless.
// Pure CSS keyframe (defined in globals.css as `.marquee`) — no JS.
export function Marquee({
  children,
  speedSeconds = 60,
  className,
}: {
  children: ReactNode;
  speedSeconds?: number;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div
        className="marquee flex w-max items-center"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
