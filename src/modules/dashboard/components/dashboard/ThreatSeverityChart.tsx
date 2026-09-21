import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Gauge } from "lucide-react";
import type { AsyncState, DashboardSnapshot } from "../../types/threat.types";
import { SEVERITY_META } from "../../theme/severity";
import { Card, CardHeader } from "../ui/Card";
import { ChartCardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { formatNumber } from "../../utils/format";

interface ThreatSeverityChartProps {
  state: AsyncState<DashboardSnapshot>;
  onRetry?: () => void;
}

export function ThreatSeverityChart({ state, onRetry }: ThreatSeverityChartProps) {
  if (state.status === "loading") return <ChartCardSkeleton />;

  if (state.status === "error") {
    return (
      <Card>
        <CardHeader title="Threat Severity" subtitle="Distribution by risk level" icon={<Gauge className="h-4 w-4" />} />
        <ErrorState message={state.error ?? undefined} onRetry={onRetry} />
      </Card>
    );
  }

  const breakdown = state.data?.severityBreakdown ?? [];
  const total = breakdown.reduce((sum, b) => sum + b.count, 0);

  return (
    <Card>
      <CardHeader title="Threat Severity" subtitle="Distribution by risk level" icon={<Gauge className="h-4 w-4" />} />
      {state.status === "empty" || total === 0 ? (
        <EmptyState title="No severity data" description="Severity distribution will populate once threats are classified." />
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-52 w-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="count"
                  nameKey="severity"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {breakdown.map((entry) => (
                    <Cell key={entry.severity} fill={SEVERITY_META[entry.severity].hex} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0B1120",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                  formatter={(value, name) => [
                    formatNumber(Number(value)),
                    SEVERITY_META[name as keyof typeof SEVERITY_META].label,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-semibold text-slate-50">{formatNumber(total)}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Total</span>
            </div>
          </div>

          <div className="w-full space-y-2.5">
            {breakdown.map((entry) => {
              const meta = SEVERITY_META[entry.severity];
              const pct = total > 0 ? Math.round((entry.count / total) * 100) : 0;
              return (
                <div key={entry.severity} className="flex items-center gap-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                  <span className="w-20 shrink-0 text-xs text-slate-300">{meta.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${meta.dot}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs text-slate-400">{entry.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
