import React from "react";
import { Globe2, CalendarClock, Lock, LockOpen, ShieldCheck, ShieldX, Fingerprint } from "lucide-react";
import type { DomainAnalysis } from "../types/threatIntel.types";
import { surfaceCard, sectionHeading, monoValue } from "../theme/socTheme";
import { ReputationBadge } from "./ReputationBadge";

interface DomainAnalysisCardProps {
  domainAnalysis: DomainAnalysis;
}

const AuthRow: React.FC<{ label: string; valid: boolean }> = ({ label, valid }) => (
  <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
    <span className="text-xs text-slate-400">{label}</span>
    {valid ? (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
        <ShieldCheck className="h-3.5 w-3.5" /> Valid
      </span>
    ) : (
      <span className="flex items-center gap-1 text-xs font-medium text-rose-400">
        <ShieldX className="h-3.5 w-3.5" /> Failed
      </span>
    )}
  </div>
);

export const DomainAnalysisCard: React.FC<DomainAnalysisCardProps> = ({
  domainAnalysis,
}) => {
  return (
    <div className={`${surfaceCard} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Domain Analysis</h3>
        </div>
        <ReputationBadge reputation={domainAnalysis.reputation} />
      </div>

      <p className={`mb-1 text-lg ${monoValue}`}>{domainAnalysis.domain}</p>
      <p className="mb-4 text-xs text-slate-500">Registrar: {domainAnalysis.registrar}</p>

      {domainAnalysis.similarityToKnownBrand && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <Fingerprint className="h-3.5 w-3.5 shrink-0" />
          <span>
            {domainAnalysis.similarityToKnownBrand.similarityScore}% visual similarity to{" "}
            <span className="font-mono">{domainAnalysis.similarityToKnownBrand.brand}</span> — likely
            typosquat / brand impersonation
          </span>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className={`${sectionHeading} flex items-center gap-1.5`}>
            <CalendarClock className="h-3 w-3" /> Domain Age
          </p>
          <p className="mt-1.5 font-mono text-sm text-slate-200">
            {domainAnalysis.ageInDays} days
          </p>
          {domainAnalysis.isNewlyRegistered && (
            <p className="mt-1 text-[11px] text-amber-400">Newly registered — high risk</p>
          )}
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className={`${sectionHeading} flex items-center gap-1.5`}>
            {domainAnalysis.sslValid ? (
              <Lock className="h-3 w-3" />
            ) : (
              <LockOpen className="h-3 w-3" />
            )}
            SSL Certificate
          </p>
          <p
            className={`mt-1.5 font-mono text-sm ${
              domainAnalysis.sslValid ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {domainAnalysis.sslValid ? "Valid" : "Invalid / Missing"}
          </p>
        </div>
      </div>

      <div>
        <p className={`${sectionHeading} mb-2`}>Email Authentication</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <AuthRow label="SPF" valid={domainAnalysis.hasValidSpf} />
          <AuthRow label="DKIM" valid={domainAnalysis.hasValidDkim} />
          <AuthRow label="DMARC" valid={domainAnalysis.hasValidDmarc} />
        </div>
      </div>
    </div>
  );
};

export default DomainAnalysisCard;
