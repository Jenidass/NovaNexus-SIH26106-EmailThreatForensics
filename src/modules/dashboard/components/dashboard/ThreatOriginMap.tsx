import { Globe2 } from "lucide-react";
import type { AsyncState, DashboardSnapshot, ThreatOrigin } from "../../types/threat.types";
import { SEVERITY_META } from "../../theme/severity";
import { Card, CardHeader } from "../ui/Card";
import { ChartCardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { formatNumber } from "../../utils/format";

interface ThreatOriginMapProps {
  state: AsyncState<DashboardSnapshot>;
  onRetry?: () => void;
}

const RADAR_SIZE = 260;
const CENTER = RADAR_SIZE / 2;
const RINGS = [0.28, 0.52, 0.76, 1];

/** Deterministic pseudo-angle so each origin always lands in the same spot. */
function angleFor(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  return (hash / 360) * 2 * Math.PI;
}

function radiusFor(origin: ThreatOrigin, maxCount: number): number {
  // Higher incident count -> closer to center (more urgent, easier to scan).
  const normalized = maxCount > 0 ? origin.incidentCount / maxCount : 0;
  const minR = RADAR_SIZE * 0.14;
  const maxR = RADAR_SIZE * 0.46;
  return maxR - normalized * (maxR - minR);
}

/**
 * Stylized threat-origin radar: a lightweight, dependency-free geolocation
 * preview. A future GeoLocation module can replace this with a full
 * interactive map while keeping the same AsyncState<DashboardSnapshot> input.
 */
export function ThreatOriginMap({ state, onRetry }: ThreatOriginMapProps) {
  if (state.status === "loading") return <ChartCardSkeleton />;

  if (state.status === "error") {
    return (
      <Card>
        <CardHeader title="Threat Origin" subtitle="GeoLocation preview" icon={<Globe2 className="h-4 w-4" />} />
        <ErrorState message={state.error ?? undefined} onRetry={onRetry} />
      </Card>
    );
  }

  const origins = state.data?.origins ?? [];
  const maxCount = Math.max(...origins.map((o) => o.incidentCount), 1);
  const topOrigins = [...origins].sort((a, b) => b.incidentCount - a.incidentCount).slice(0, 6);

  return (
    <Card>
      <CardHeader
        title="Threat Origin"
        subtitle="GeoLocation preview \u2014 top source countries"
        icon={<Globe2 className="h-4 w-4" />}
        action={
          <span className="text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300 cursor-pointer">
            Open full map
          </span>
        }
      />

      {state.status === "empty" || origins.length === 0 ? (
        <EmptyState title="No geolocation data" description="Origin IPs will be plotted here once threats are geo-resolved." />
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0" style={{ width: RADAR_SIZE, height: RADAR_SIZE }}>
            <svg width={RADAR_SIZE} height={RADAR_SIZE} viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}>
              <defs>
                <radialGradient id="radarFade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={CENTER} cy={CENTER} r={RADAR_SIZE * 0.48} fill="url(#radarFade)" />
              {RINGS.map((r) => (
                <circle
                  key={r}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADAR_SIZE * 0.46 * r}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth={1}
                />
              ))}
              <line x1={CENTER} y1={4} x2={CENTER} y2={RADAR_SIZE - 4} stroke="#1e293b" strokeWidth={1} />
              <line x1={4} y1={CENTER} x2={RADAR_SIZE - 4} y2={CENTER} stroke="#1e293b" strokeWidth={1} />

              {/* rotating sweep */}
              <g style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
                <path
                  d={`M ${CENTER} ${CENTER} L ${CENTER} 4 A ${CENTER - 4} ${CENTER - 4} 0 0 1 ${CENTER + (CENTER - 4) * Math.sin(0.7)} ${
                    CENTER - (CENTER - 4) * Math.cos(0.7)
                  } Z`}
                  fill="#22d3ee"
                  opacity={0.08}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${CENTER} ${CENTER}`}
                    to={`360 ${CENTER} ${CENTER}`}
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              {origins.map((origin) => {
                const angle = angleFor(origin.id);
                const r = radiusFor(origin, maxCount);
                const x = CENTER + r * Math.sin(angle);
                const y = CENTER - r * Math.cos(angle);
                const meta = SEVERITY_META[origin.severity];
                return (
                  <g key={origin.id}>
                    <circle cx={x} cy={y} r={9} fill={meta.hex} opacity={0.15}>
                      <animate attributeName="r" values="7;13;7" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.25;0;0.25" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={x} cy={y} r={4} fill={meta.hex} stroke="#0B1120" strokeWidth={1.5} />
                  </g>
                );
              })}

              <circle cx={CENTER} cy={CENTER} r={3} fill="#e2e8f0" />
            </svg>
          </div>

          <div className="w-full space-y-2">
            {topOrigins.map((origin) => {
              const meta = SEVERITY_META[origin.severity];
              return (
                <div
                  key={origin.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        {origin.country} <span className="text-slate-500">({origin.countryCode})</span>
                      </p>
                      <p className="text-[11px] text-slate-500">{origin.city}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-slate-300">{formatNumber(origin.incidentCount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
