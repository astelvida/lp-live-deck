import { ImageResponse } from "next/og";
import { getHeroData } from "@/lib/notion";

export const runtime = "nodejs";
export const alt = "Signals Over Stories — a fund thesis, rendered in real time";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let stats = { pipelineCount: 0, escalatingSignals: 0 };
  try {
    const h = await getHeroData();
    stats = {
      pipelineCount: h.companiesTracked,
      escalatingSignals: h.escalatingSignals,
    };
  } catch {
    // fall through to zero values — OG still renders
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F1E8",
          padding: 64,
          fontFamily: "serif",
          color: "#1a1210",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: "#D93832" }}>
          <span>LIVE — Signals Over Stories</span>
          <span>{new Date().toISOString().slice(0, 10)}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 500, lineHeight: 0.95, letterSpacing: -3 }}>
            A fund thesis,
          </div>
          <div style={{ fontSize: 96, fontWeight: 500, lineHeight: 0.95, letterSpacing: -3, fontStyle: "italic", color: "#D93832" }}>
            rendered in real time.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24, color: "#5c443a" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>Pipeline</span>
            <span style={{ fontSize: 64, color: "#1a1210", letterSpacing: -2 }}>{stats.pipelineCount}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>Escalating signals</span>
            <span style={{ fontSize: 64, color: "#1a1210", letterSpacing: -2 }}>{stats.escalatingSignals}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
