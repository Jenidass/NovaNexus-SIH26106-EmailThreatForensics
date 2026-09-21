import { RadioTower, ShieldCheck, RefreshCw } from "lucide-react";
import { formatDateTime } from "../../utils/format";

interface DashboardHeaderProps {
  generatedAt?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

/**
 * Top-of-page security overview header. Reused (in trimmed form) as the
 * banner pattern for every other Nova Nexus module.
 */
export function DashboardHeader({ generatedAt, onRefresh, isRefreshing }: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-r from-[#0B1120] via-[#0B1424] to-[#0B1120] p-6">
      {/* subtle scan-line grid, signature background texture for the whole app */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                Nova Nexus &mdash; Security Overview
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              SIH26106 &middot; AI-Powered Email Threat Detection, GeoLocation &amp; Forensic Intelligence Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <RadioTower className="h-3.5 w-3.5 text-cyan-500" />
            <span>
              Last sync: <span className="text-slate-300">{generatedAt ? formatDateTime(generatedAt) : "\u2014"}</span>
            </span>
          </div>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
