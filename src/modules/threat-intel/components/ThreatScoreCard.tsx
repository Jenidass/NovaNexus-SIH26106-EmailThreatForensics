import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { Gauge, Clock, Cpu } from "lucide-react";
import type { ThreatScore } from "../types/threatIntel.types";
import { severityStyles, surfaceCard } from "../theme/socTheme";
import { SeverityBadge } from "./SeverityBadge";

interface ThreatScoreCardProps {
  threatScore: ThreatScore;
}

const gaugeColor: Record<ThreatScore["severity"], string> = {
  critical: "#fb7185", // rose-400
  high: "#fb923c", // orange-400
  medium: "#fbbf24", // amber-400
  low: "#22d3ee", // cyan-400
  info: "#94a3b8", // slate-400
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ThreatScoreCard: React.FC<ThreatScoreCardProps> = ({ threatScore }) => {
  const styles = severityStyles[threatScore.severity];
  const color = gaugeColor[threatScore.severity];
  const gaugeData = [{ name: "score", value: threatScore.score, fill: color }];

  return (
    <div className={`${surfaceCard} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Overall Threat Score
          </h3>
        </div>
        <SeverityBadge severity={threatScore.severity} />
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-40 w-40 shrink-0">
          <RadialBarChart
            width={160}
            height={160}
            innerRadius="72%"
            outerRadius="100%"
            barSize={12}
            data={gaugeData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: "#1e293b" }}
              dataKey="value"
              cornerRadius={8}
            />
          </RadialBarChart>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${styles.text}`}>
              {threatScore.score}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-500">
              / 100 risk
            </span>
          </div>
        </div>

        <div className="w-full min-w-0 space-y-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Classification
            </p>
            <p className="text-lg font-semibold text-slate-100">
              {threatScore.classification}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Cpu className="h-3 w-3" /> Confidence
              </p>
              <p className="font-mono text-sm text-slate-200">
                {threatScore.confidence}%
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="h-3 w-3" /> Last Analyzed
              </p>
              <p className="font-mono text-sm text-slate-200">
                {formatTimestamp(threatScore.lastAnalyzed)}
              </p>
            </div>
          </div>

          <p className="truncate text-[11px] text-slate-600">
            Model: {threatScore.modelVersion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreatScoreCard;
