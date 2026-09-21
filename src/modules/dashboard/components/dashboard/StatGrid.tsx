import { AlertOctagon, FolderSearch, Mail, ShieldAlert, Siren } from "lucide-react";
import type { AsyncState, DashboardSnapshot } from "../../types/threat.types";
import { StatCard } from "./StatCard";
import { StatCardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

const ICON_BY_ID: Record<string, { icon: React.ReactNode; tone: "cyan" | "rose" | "orange" | "amber" }> = {
  "total-investigations": { icon: <FolderSearch className="h-4 w-4" />, tone: "cyan" },
  "threats-detected": { icon: <ShieldAlert className="h-4 w-4" />, tone: "orange" },
  "high-risk-emails": { icon: <Mail className="h-4 w-4" />, tone: "amber" },
  "critical-threats": { icon: <Siren className="h-4 w-4" />, tone: "rose" },
  "suspicious-indicators": { icon: <AlertOctagon className="h-4 w-4" />, tone: "cyan" },
};

interface StatGridProps {
  state: AsyncState<DashboardSnapshot>;
  onRetry?: () => void;
}

export function StatGrid({ state, onRetry }: StatGridProps) {
  if (state.status === "loading") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return <ErrorState message={state.error ?? undefined} onRetry={onRetry} />;
  }

  const stats = state.data?.stats ?? [];

  if (state.status === "empty" || stats.length === 0) {
    return <EmptyState title="No metrics available" description="Headline stats will appear once detections start coming in." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((metric) => {
        const meta = ICON_BY_ID[metric.id] ?? { icon: <ShieldAlert className="h-4 w-4" />, tone: "cyan" as const };
        return <StatCard key={metric.id} metric={metric} icon={meta.icon} tone={meta.tone} />;
      })}
    </div>
  );
}
