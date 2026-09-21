# API contract notes

None of the 4 ZIPs include any backend call — every module renders from
local mock data (`data/mock*.ts`) only. There is therefore **no existing
API contract to break**; wiring to the real FastAPI backend is new work,
not a migration. This file documents what each module's TypeScript types
imply the backend response shape should be, so you can compare it against
your actual FastAPI Pydantic schemas before wiring `apiFetch` calls in.

## dashboard (`src/modules/dashboard/types/threat.types.ts`)
Expects: investigations list, threat-severity counts, threat-category
counts, recent-activity timeline, geo-origin points — i.e. it wants a
single "dashboard summary" endpoint (something like `GET /dashboard/summary`)
that pre-aggregates counts, not raw investigation rows. Confirm your
Dashboard API module returns pre-aggregated data, or add an aggregation
step in `useDashboardData`.

## new-investigation (`src/modules/new-investigation/types/investigation.ts`)
Expects a synchronous-feeling flow: upload → `AnalysisStep[]` progress →
`InvestigationResult`. If your backend's email-analysis endpoint is async
(e.g. `POST /investigate` returns a job id, poll `GET /investigate/{id}`),
`ProcessingView.tsx`'s step list will need to be driven by real polling
data instead of the current fixed mock timer in
`data/mockInvestigation.ts::buildAnalysisSteps`. Flagging, not changing,
since that's a behavioral (not visual) change.

## threat-intel (`src/modules/threat-intel/types/threatIntel.types.ts`)
Expects one `ThreatIntelligenceReport` object bundling IP reputation,
domain analysis, sender info, IOC list, and geolocation together. If your
backend splits these across separate modules (Threat Intelligence vs
GeoLocation vs Evidence, per the problem statement), you'll need a small
adapter in `routes/ThreatIntelRoute.tsx` that calls multiple endpoints and
assembles them into this shape — the component itself expects the merged
shape and shouldn't be edited to avoid changing its rendering.

## sentinel-trace (`src/modules/sentinel-trace/types/investigation.ts`)
Uses UPPERCASE enum-like string unions (`'SAFE' | 'SUSPICIOUS' | 'HIGH' |
'CRITICAL'`, `'PASS' | 'WARN' | 'FAIL'`), while dashboard and threat-intel
both use lowercase (`'critical' | 'high' | 'medium' | 'low'`). If your
FastAPI schemas return one casing, the route for whichever module expects
the other casing needs an adapter — do NOT change the casing inside the
module's own type files, since severity-based Tailwind class lookups
(`severityStyles[severity]`) are keyed off these exact literal strings and
silently "fixing" the casing will blank out every severity color in that
module.

## General
- All 4 modules are 100% mock-data-driven today. Nothing will visibly
  break if backend wiring is deferred — safe to integrate the UI first,
  wire APIs module-by-module after.
- Recommended next step per module: replace the mock import in each
  `routes/*.tsx` file with an `apiFetch` call, keeping the exact same
  prop shape the component already expects.
