/**
 * Public entry point for the SentinelTrace investigation-detail module.
 * Added during integration — no original component files were modified.
 *
 * NOTE: SentinelTrace's original App.tsx (kept here as
 * App.reference-shell.tsx) rendered its OWN header + tab shell + mock data
 * wiring all in one file. It was not split into a reusable "Page" component
 * by the author. To embed it as a route without editing the author's file,
 * routes/SentinelTraceRoute.tsx re-creates only the outer <div> shell
 * (copied verbatim, unedited) and composes the same tab components this
 * file re-exports below.
 */
export { default as CaseHeader } from "./components/CaseHeader";
export { default as ThreatScoreGauge } from "./components/ThreatScoreGauge";
export { default as DetectedSignals } from "./components/overview/DetectedSignals";
export { default as Recommendations } from "./components/overview/Recommendations";
export { default as RiskBreakdown } from "./components/overview/RiskBreakdown";
export { default as OverviewTab } from "./components/tabs/OverviewTab";
export { default as EmailTab } from "./components/tabs/EmailTab";
export { default as HeadersTab } from "./components/tabs/HeadersTab";
export { default as AuthenticationTab } from "./components/tabs/AuthenticationTab";
export { default as UrlsTab } from "./components/tabs/UrlsTab";
export { default as InfrastructureTab } from "./components/tabs/InfrastructureTab";
export { default as AiAnalysisTab } from "./components/tabs/AiAnalysisTab";
export { default as SentinelTabs } from "./components/ui/Tabs";
export { default as SentinelCard } from "./components/ui/Card";
export { default as SentinelBadge } from "./components/ui/Badge";
export { default as ExpandableSection } from "./components/ui/ExpandableSection";
export { default as Tooltip } from "./components/ui/Tooltip";

export * from "./types/investigation";
export * from "./data/mockInvestigation";
