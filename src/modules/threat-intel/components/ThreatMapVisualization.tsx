import React, { useMemo, useState } from "react";
import { Globe, Radar } from "lucide-react";
import type { ThreatOriginNode } from "../types/threatIntel.types";
import { surfaceCard, severityStyles } from "../theme/socTheme";

interface ThreatMapVisualizationProps {
  path: ThreatOriginNode[];
}

const VIEW_W = 1000;
const VIEW_H = 480;

/**
 * Naive equirectangular projection (lat/long -> SVG coordinates).
 * This keeps the module fully backend/API-free for the SIH demo while
 * staying geographically proportionate. To upgrade to a real interactive
 * map later (Leaflet / Mapbox GL / Google Maps), swap this component's
 * internals only — `ThreatOriginNode[]` (lat, lng, severity, order) is
 * already the exact shape most map SDKs expect for markers + polylines.
 */
function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * VIEW_W;
  const y = ((90 - lat) / 180) * VIEW_H;
  return { x, y };
}

const nodeColor: Record<ThreatOriginNode["severity"], string> = {
  critical: "#fb7185",
  high: "#fb923c",
  medium: "#fbbf24",
  low: "#22d3ee",
  info: "#94a3b8",
};

/** Generates a light dotted "world" texture without shipping real map tile assets. */
function useDotGrid() {
  return useMemo(() => {
    const dots: { x: number; y: number }[] = [];
    const stepX = 22;
    const stepY = 22;
    for (let y = stepY; y < VIEW_H; y += stepY) {
      for (let x = stepX; x < VIEW_W; x += stepX) {
        // Skip a wavy band to loosely suggest ocean/landmass without real geometry.
        const wave = Math.sin(x / 90) * 40 + Math.cos(y / 70) * 20;
        if ((x + y) % 3 !== 0 || Math.abs(wave) > 55) continue;
        dots.push({ x, y });
      }
    }
    return dots;
  }, []);
}

export const ThreatMapVisualization: React.FC<ThreatMapVisualizationProps> = ({
  path,
}) => {
  const [activeHop, setActiveHop] = useState<string | null>(null);
  const dots = useDotGrid();
  const sorted = useMemo(() => [...path].sort((a, b) => a.hopOrder - b.hopOrder), [path]);
  const points = sorted.map((n) => ({ ...n, ...project(n.latitude, n.longitude) }));

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    return `${acc} L ${p.x} ${p.y}`;
  }, "");

  const active = points.find((p) => p.id === activeHop) ?? points[0];

  return (
    <div className={`${surfaceCard} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Threat Origin &amp; Routing Path
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Radar className="h-3 w-3 animate-pulse text-cyan-400" />
          {points.length} hops traced
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
        <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-[#050b16]">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-full w-full"
            role="img"
            aria-label="Map-style visualization of the traced threat origin path"
          >
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#0e2a3f" />
                <stop offset="100%" stopColor="#050b16" />
              </radialGradient>
              <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width={VIEW_W} height={VIEW_H} fill="url(#mapGlow)" />

            {/* Latitude / longitude reference lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`lat-${i}`}
                x1={0}
                x2={VIEW_W}
                y1={(i + 1) * (VIEW_H / 6)}
                y2={(i + 1) * (VIEW_H / 6)}
                stroke="#132338"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`lng-${i}`}
                y1={0}
                y2={VIEW_H}
                x1={(i + 1) * (VIEW_W / 10)}
                x2={(i + 1) * (VIEW_W / 10)}
                stroke="#132338"
                strokeWidth={1}
              />
            ))}

            {/* Stylized landmass texture */}
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={1.1} fill="#1e3a52" />
            ))}

            {/* Routing path */}
            <path
              d={pathD}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={1.5}
              strokeDasharray="6 5"
              opacity={0.8}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-22"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </path>

            {/* Hop nodes */}
            {points.map((p) => (
              <g
                key={p.id}
                transform={`translate(${p.x}, ${p.y})`}
                onMouseEnter={() => setActiveHop(p.id)}
                className="cursor-pointer"
              >
                <circle r={10} fill={nodeColor[p.severity]} opacity={0.15} />
                <circle r={5} fill={nodeColor[p.severity]} filter="url(#nodeGlow)" />
                <circle r={5} fill="none" stroke="#050b16" strokeWidth={1.5} />
                <text
                  y={-14}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#cbd5e1"
                  fontFamily="ui-monospace, monospace"
                >
                  {p.hopOrder}
                </text>
              </g>
            ))}
          </svg>

          <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-[10px] text-slate-500 backdrop-blur">
            <span>Illustrative projection</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Ready for live map SDK integration</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {points.map((p) => {
            const styles = severityStyles[p.severity];
            const isActive = active?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onMouseEnter={() => setActiveHop(p.id)}
                onClick={() => setActiveHop(p.id)}
                className={`rounded-lg border p-2.5 text-left transition-colors ${
                  isActive
                    ? `${styles.border} ${styles.bg}`
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300">
                    Hop {p.hopOrder} · {p.city}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                </div>
                <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                  {p.ip}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-slate-600">{p.label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThreatMapVisualization;
