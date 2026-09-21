import React from "react";
import type { LucideIcon } from "lucide-react";
import { surfaceCard } from "../theme/socTheme";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "cyan" | "rose" | "amber" | "emerald" | "slate";
  hint?: string;
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  slate: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  accent = "cyan",
  hint,
}) => {
  return (
    <div className={`${surfaceCard} flex items-center gap-4 p-4`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${accentClasses[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="truncate text-lg font-semibold text-slate-100">{value}</p>
        {hint && <p className="truncate text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
};

export default StatCard;
