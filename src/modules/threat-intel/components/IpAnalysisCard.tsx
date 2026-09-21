import React from "react";
import { Network, ShieldBan, EyeOff, Server, Waypoints, Ban, CheckCircle2 } from "lucide-react";
import type { IpAnalysis } from "../types/threatIntel.types";
import { surfaceCard, sectionHeading, monoValue } from "../theme/socTheme";
import { ReputationBadge } from "./ReputationBadge";

interface IpAnalysisCardProps {
  ipAnalysis: IpAnalysis;
}

const FlagPill: React.FC<{ label: string; active: boolean; icon: React.ComponentType<{ className?: string }> }> = ({
  label,
  active,
  icon: Icon,
}) => (
  <div
    className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${
      active
        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
        : "border-slate-800 bg-slate-950/40 text-slate-600"
    }`}
  >
    <Icon className="h-3 w-3" />
    {label}
  </div>
);

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const IpAnalysisCard: React.FC<IpAnalysisCardProps> = ({ ipAnalysis }) => {
  return (
    <div className={`${surfaceCard} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">IP Address Analysis</h3>
        </div>
        <ReputationBadge reputation={ipAnalysis.reputation} />
      </div>

      <p className={`mb-4 text-xl ${monoValue}`}>{ipAnalysis.address}</p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className={sectionHeading}>Abuse Confidence</p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${ipAnalysis.abuseConfidenceScore}%` }}
              />
            </div>
            <span className="font-mono text-xs text-slate-300">
              {ipAnalysis.abuseConfidenceScore}%
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className={sectionHeading}>Total Reports</p>
          <p className="mt-1.5 font-mono text-sm text-slate-200">
            {ipAnalysis.totalReports.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <FlagPill label="Tor Exit Node" active={ipAnalysis.isTor} icon={EyeOff} />
        <FlagPill label="Proxy" active={ipAnalysis.isProxy} icon={Waypoints} />
        <FlagPill label="VPN" active={ipAnalysis.isVpn} icon={ShieldBan} />
        <FlagPill label="Datacenter" active={ipAnalysis.isDatacenter} icon={Server} />
      </div>

      <div className="mb-4">
        <p className={`${sectionHeading} mb-2`}>Blacklist Status</p>
        <div className="flex flex-wrap gap-2">
          {ipAnalysis.blacklists.map((list) => (
            <div
              key={list.name}
              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] ${
                list.listed
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                  : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
              }`}
            >
              {list.listed ? <Ban className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
              {list.name}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-xs">
        <div>
          <p className="text-slate-500">First Seen</p>
          <p className="font-mono text-slate-300">{formatDate(ipAnalysis.firstSeen)}</p>
        </div>
        <div>
          <p className="text-slate-500">Last Reported</p>
          <p className="font-mono text-slate-300">{formatDate(ipAnalysis.lastReportedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default IpAnalysisCard;
