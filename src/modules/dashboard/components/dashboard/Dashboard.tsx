import { useState } from "react";
import { useDashboardData, type DemoMode } from "../../hooks/useDashboardData";
import { DashboardHeader } from "./DashboardHeader";
import { StatGrid } from "./StatGrid";
import { ThreatSeverityChart } from "./ThreatSeverityChart";
import { ThreatCategoryChart } from "./ThreatCategoryChart";
import { RecentInvestigationsTable } from "./RecentInvestigationsTable";
import { SecurityActivityTimeline } from "./SecurityActivityTimeline";
import { ThreatOriginMap } from "./ThreatOriginMap";
import { DemoModeSwitcher } from "./DemoModeSwitcher";

/**
 * Nova Nexus — main security dashboard.
 * Drop this component into any route; it is fully self-contained and reads
 * only from the mock data layer (src/data/mockData.ts) via useDashboardData.
 */
export default function Dashboard() {
  const [demoMode, setDemoMode] = useState<DemoMode>("success");
  const state = useDashboardData({ mode: demoMode, delayMs: 800 });

  return (
    <div className="min-h-screen w-full bg-[#070B14] text-slate-200">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.08), transparent)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <DashboardHeader
              generatedAt={state.data?.generatedAt}
              onRefresh={state.refetch}
              isRefreshing={state.status === "loading"}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <DemoModeSwitcher mode={demoMode} onChange={setDemoMode} />
        </div>

        <StatGrid state={state} onRetry={state.refetch} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ThreatSeverityChart state={state} onRetry={state.refetch} />
          </div>
          <div className="lg:col-span-2">
            <ThreatCategoryChart state={state} onRetry={state.refetch} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentInvestigationsTable state={state} onRetry={state.refetch} />
          </div>
          <div>
            <SecurityActivityTimeline state={state} onRetry={state.refetch} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <ThreatOriginMap state={state} onRetry={state.refetch} />
        </div>

        <footer className="pb-4 pt-2 text-center text-[11px] text-slate-600">
          Nova Nexus &middot; SIH26106 &middot; All data shown is simulated for demonstration purposes
        </footer>
      </div>
    </div>
  );
}
