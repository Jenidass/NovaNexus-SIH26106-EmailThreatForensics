// Unlike new-investigation's App.tsx, SentinelTrace's original App.tsx
// (kept as modules/sentinel-trace/App.reference-shell.tsx) IS the real
// page content — header, tabs, and all — not a throwaway demo shell.
// Everything below is copied verbatim from that file. The only two
// changes are: (1) import paths now point into modules/sentinel-trace/,
// and (2) the outer div gets the `sentinel-trace-scope` class so its
// body-level background (see scoped-background.css) doesn't leak onto
// the other three routes.
import { useState } from "react";
import {
  LayoutGrid,
  Mail,
  ListTree,
  KeyRound,
  Link2,
  Network,
  Sparkles,
  ShieldHalf,
} from "lucide-react";
import Tabs, { type TabDef } from "../modules/sentinel-trace/components/ui/Tabs";
import CaseHeader from "../modules/sentinel-trace/components/CaseHeader";
import OverviewTab from "../modules/sentinel-trace/components/tabs/OverviewTab";
import EmailTab from "../modules/sentinel-trace/components/tabs/EmailTab";
import HeadersTab from "../modules/sentinel-trace/components/tabs/HeadersTab";
import AuthenticationTab from "../modules/sentinel-trace/components/tabs/AuthenticationTab";
import UrlsTab from "../modules/sentinel-trace/components/tabs/UrlsTab";
import InfrastructureTab from "../modules/sentinel-trace/components/tabs/InfrastructureTab";
import AiAnalysisTab from "../modules/sentinel-trace/components/tabs/AiAnalysisTab";
import {
  caseSummary,
  detectedSignals,
  riskBreakdown,
  recommendations,
  emailMeta,
  emailHeaders,
  authChecks,
  suspiciousUrls,
  infraNodes,
  aiFindings,
} from "../modules/sentinel-trace/data/mockInvestigation";
import "../modules/sentinel-trace/styles/scoped-background.css";

const TAB_DEFS: TabDef[] = [
  { id: "overview", label: "Overview", icon: <LayoutGrid size={15} /> },
  { id: "email", label: "Email", icon: <Mail size={15} /> },
  { id: "headers", label: "Headers", icon: <ListTree size={15} /> },
  { id: "authentication", label: "Authentication", icon: <KeyRound size={15} /> },
  { id: "urls", label: "URLs", icon: <Link2 size={15} /> },
  { id: "infrastructure", label: "Infrastructure", icon: <Network size={15} /> },
  { id: "ai", label: "AI Analysis", icon: <Sparkles size={15} /> },
];

export default function SentinelTraceRoute() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="sentinel-trace-scope min-h-full pb-16">
      <header className="sticky top-0 z-40 border-b border-base-700 bg-base-950/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-teal/10 border border-signal-teal/30">
            <ShieldHalf size={16} className="text-signal-teal" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wide text-base-100">SENTINELTRACE</span>
          <span className="hidden sm:inline text-xs text-base-500 font-mono">/ investigation console</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <CaseHeader summary={caseSummary} />

        <div className="rounded-xl border border-base-700 bg-base-850/60">
          <div className="px-2 sm:px-4">
            <Tabs tabs={TAB_DEFS} activeId={activeTab} onChange={setActiveTab} />
          </div>
          <div className="p-4 sm:p-6">
            {activeTab === "overview" && (
              <OverviewTab
                summary={caseSummary}
                signals={detectedSignals}
                risk={riskBreakdown}
                recommendations={recommendations}
              />
            )}
            {activeTab === "email" && <EmailTab meta={emailMeta} />}
            {activeTab === "headers" && <HeadersTab headers={emailHeaders} />}
            {activeTab === "authentication" && <AuthenticationTab checks={authChecks} />}
            {activeTab === "urls" && <UrlsTab urls={suspiciousUrls} />}
            {activeTab === "infrastructure" && <InfrastructureTab nodes={infraNodes} />}
            {activeTab === "ai" && <AiAnalysisTab findings={aiFindings} />}
          </div>
        </div>

        <p className="text-center text-[11px] font-mono text-base-600">
          All case data on this screen is fictional demo content generated for SentinelTrace UI development.
        </p>
      </main>
    </div>
  );
}
