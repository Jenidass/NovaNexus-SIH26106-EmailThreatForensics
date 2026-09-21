import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Layers } from "lucide-react";
import type { AsyncState, DashboardSnapshot } from "../../types/threat.types";
import { Card, CardHeader } from "../ui/Card";
import { ChartCardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { formatNumber } from "../../utils/format";

interface ThreatCategoryChartProps {
  state: AsyncState<DashboardSnapshot>;
  onRetry?: () => void;
}

export function ThreatCategoryChart({ state, onRetry }: ThreatCategoryChartProps) {
  if (state.status === "loading") return <ChartCardSkeleton />;

  if (state.status === "error") {
    return (
      <Card>
        <CardHeader title="Threat Categories" subtitle="Detections by attack type" icon={<Layers className="h-4 w-4" />} />
        <ErrorState message={state.error ?? undefined} onRetry={onRetry} />
      </Card>
    );
  }

  const breakdown = state.data?.categoryBreakdown ?? [];

  return (
    <Card>
      <CardHeader title="Threat Categories" subtitle="Detections by attack type" icon={<Layers className="h-4 w-4" />} />
      {state.status === "empty" || breakdown.length === 0 ? (
        <EmptyState title="No category data" description="Attack-type breakdown will populate once emails are classified." />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdown} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                width={150}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(34,211,238,0.06)" }}
                contentStyle={{
                  background: "#0B1120",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#e2e8f0",
                }}
                formatter={(value) => [formatNumber(Number(value)), "Detections"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#22d3ee" maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
