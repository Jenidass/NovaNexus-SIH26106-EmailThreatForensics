import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { StatMetric } from "../../types/threat.types";
import { formatNumber, formatSigned } from "../../utils/format";
import { Card } from "../ui/Card";

interface StatCardProps {
  metric: StatMetric;
  icon: ReactNode;
  /** Accent used for the icon chip; keep on-brand (cyan/blue) unless flagging risk. */
  tone?: "cyan" | "rose" | "orange" | "amber";
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  cyan: "border-cyan-500/25 bg-cyan-500/10 text-cyan-400",
  rose: "border-rose-500/25 bg-rose-500/10 text-rose-400",
  orange: "border-orange-500/25 bg-orange-500/10 text-orange-400",
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-400",
};

export function StatCard({ metric, icon, tone = "cyan" }: StatCardProps) {
  const TrendIcon = metric.trend === "up" ? ArrowUpRight : metric.trend === "down" ? ArrowDownRight : Minus;
  const trendColor =
    metric.trend === "up"
      ? "text-emerald-400"
      : metric.trend === "down"
      ? "text-rose-400"
      : "text-slate-500";

  return (
    <Card className="relative overflow-hidden transition-colors hover:border-slate-700">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{metric.label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${TONE_CLASSES[tone]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tabular-nums text-slate-50">
          {formatNumber(metric.value)}
        </span>
        <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {formatSigned(metric.delta)}
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-500">{metric.caption}</p>
    </Card>
  );
}
