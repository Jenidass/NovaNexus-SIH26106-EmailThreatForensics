import React from "react";
import {
  ShieldAlert,
  Mail,
  CalendarClock,
  Hash as HashIcon,
  Network,
  Globe2,
  FileWarning,
} from "lucide-react";
import type { RequestState, ThreatIntelligenceReport } from "./types/threatIntel.types";
import { ThreatScoreCard } from "./components/ThreatScoreCard";
import { IpAnalysisCard } from "./components/IpAnalysisCard";
import { DomainAnalysisCard } from "./components/DomainAnalysisCard";
import { SenderInfoCard } from "./components/SenderInfoCard";
import { IocList } from "./components/IocList";
import { GeoLocationCard } from "./components/GeoLocationCard";
import { ThreatMapVisualization } from "./components/ThreatMapVisualization";
import { RelatedIndicatorsCard } from "./components/RelatedIndicatorsCard";
import { StatCard } from "./components/StatCard";
import { LoadingState } from "./components/states/LoadingState";
import { EmptyState } from "./components/states/EmptyState";
import { ErrorState } from "./components/states/ErrorState";

export interface ThreatIntelligenceModuleProps {
  /** Drives which top-level UI state renders. Defaults to "success". */
  state?: RequestState;
  /** The report to render when `state` is "success". */
  report?: ThreatIntelligenceReport;
  /** Called when the user retries after an error. */
  onRetry?: () => void;
  /** Called when the user acts on the empty state's call to action. */
  onSelectCase?: () => void;
}

function formatReceivedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Threat Intelligence & GeoLocation module — Nova Nexus (SIH26106).
 *
 * Fully self-contained and backend-agnostic: pass a `ThreatIntelligenceReport`
 * (see src/types/threatIntel.types.ts) via the `report` prop once the AI
 * detection pipeline is wired up. Until then, render with the bundled mock
 * data (src/data/mockThreatData.ts) for demos and UI development.
 */
export const ThreatIntelligenceModule: React.FC<ThreatIntelligenceModuleProps> = ({
  state = "success",
  report,
  onRetry,
  onSelectCase,
}) => {
  return (
    <div className="min-h-full w-full bg-[#040810] text-slate-200">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Module header */}
        <header className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-800/50 bg-cyan-500/10">
              <ShieldAlert className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-100">
                Threat Intelligence &amp; GeoLocation
              </h1>
              <p className="text-xs text-slate-500">
                Nova Nexus · SIH26106 — AI-Powered Email Threat Detection &amp; Forensic
                Intelligence Platform
              </p>
            </div>
          </div>

          {state === "success" && report && (
            <div className="flex items-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs sm:self-auto">
              <span className="font-mono text-slate-500">{report.caseId}</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1 text-slate-400">
                <CalendarClock className="h-3 w-3" />
                {formatReceivedAt(report.receivedAt)}
              </span>
            </div>
          )}
        </header>

        {state === "loading" && <LoadingState />}
        {state === "empty" && <EmptyState onAction={onSelectCase} actionLabel={onSelectCase ? "Browse scanned emails" : undefined} />}
        {state === "error" && <ErrorState onRetry={onRetry} />}

        {state === "success" && report && (
          <>
            {/* Subject line + quick overview stats */}
            <section>
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
                <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                <p className="truncate text-sm text-slate-300">{report.emailSubject}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Threat Score"
                  value={`${report.threatScore.score}/100`}
                  icon={ShieldAlert}
                  accent={report.threatScore.score >= 60 ? "rose" : "emerald"}
                  hint={report.threatScore.classification}
                />
                <StatCard
                  label="Origin Country"
                  value={report.geoLocation.country}
                  icon={Globe2}
                  accent={report.geoLocation.isHighRiskRegion ? "amber" : "cyan"}
                  hint={report.geoLocation.city}
                />
                <StatCard
                  label="Source IP"
                  value={report.ipAnalysis.address}
                  icon={Network}
                  accent={report.ipAnalysis.reputation === "malicious" ? "rose" : "emerald"}
                  hint={report.ipAnalysis.reputation}
                />
                <StatCard
                  label="IOCs Extracted"
                  value={report.indicators.length}
                  icon={HashIcon}
                  accent={report.indicators.length > 0 ? "amber" : "slate"}
                  hint={`${report.relatedIndicators.length} related`}
                />
              </div>
            </section>

            {/* Threat score + sender + domain */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ThreatScoreCard threatScore={report.threatScore} />
              </div>
              <SenderInfoCard senderInfo={report.senderInfo} />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <IpAnalysisCard ipAnalysis={report.ipAnalysis} />
              <DomainAnalysisCard domainAnalysis={report.domainAnalysis} />
            </section>

            {/* GeoLocation + map */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
              <GeoLocationCard geoLocation={report.geoLocation} />
              <ThreatMapVisualization path={report.threatOriginPath} />
            </section>

            {/* IOCs */}
            {report.indicators.length > 0 ? (
              <IocList indicators={report.indicators} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                <FileWarning className="h-5 w-5 text-slate-600" />
                <p className="text-sm text-slate-500">
                  No indicators of compromise were extracted from this message.
                </p>
              </div>
            )}

            {/* Related indicators */}
            <RelatedIndicatorsCard relatedIndicators={report.relatedIndicators} />
          </>
        )}
      </div>
    </div>
  );
};

export default ThreatIntelligenceModule;
