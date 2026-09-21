# Nova Nexus — Threat Intelligence & GeoLocation Module

**Problem Statement:** SIH26106 — AI-Powered Email Threat Detection, GeoLocation and
Forensic Intelligence Platform

This package contains **one self-contained frontend module**: the Threat
Intelligence & GeoLocation dashboard. It is source-only (React + TypeScript +
Tailwind + Lucide icons) and is meant to be dropped into your existing Nova
Nexus frontend project. It intentionally does **not** include `package.json`,
`vite.config`, `tsconfig.json`, `index.html`, or any backend/API code — wire
those up in your own app shell.

Everything renders from bundled mock data, so it works standalone for demos
before the AI detection backend exists.

---

## What's inside

```
src/
  types/
    threatIntel.types.ts      # All shared TypeScript interfaces/types
  theme/
    socTheme.ts                # Shared color tokens for severity/reputation/etc.
                                # (reuse this in future modules for a consistent look)
  data/
    mockThreatData.ts          # Realistic mock report (phishing case + clean case)
  components/
    SeverityBadge.tsx
    ReputationBadge.tsx
    StatCard.tsx
    ThreatScoreCard.tsx        # Overall threat score gauge + classification
    IpAnalysisCard.tsx         # IP reputation, abuse score, Tor/proxy/VPN flags, blacklists
    DomainAnalysisCard.tsx     # Domain age, SPF/DKIM/DMARC, SSL, brand-similarity
    SenderInfoCard.tsx         # Sender identity, spoofing, reply-to mismatch
    IocList.tsx                 # Filterable IOC table (IP / domain / URL / hash / email)
    GeoLocationCard.tsx        # Country / city / region / ASN / ISP
    ThreatMapVisualization.tsx # Map-style SVG visualization of the routing/origin path
    RelatedIndicatorsCard.tsx  # Related suspicious indicators / campaign links
    states/
      LoadingState.tsx
      EmptyState.tsx
      ErrorState.tsx
  ThreatIntelligenceModule.tsx # Main composed screen — the component you embed
  ThreatIntelligenceDemo.tsx   # Optional demo harness with state/data toggles (for SIH judging)
  index.ts                     # Barrel export

tailwind.config.snippet.js     # Theme tokens to merge into your real tailwind.config.js
```

## Requirements (already assumed present in your host app)

- React 18+ (functional components / hooks)
- TypeScript
- Tailwind CSS
- `lucide-react`
- `recharts` (used only for the threat-score radial gauge)

Install the two libraries in your existing project if not already present:

```bash
npm install lucide-react recharts
```

## Usage

```tsx
import { ThreatIntelligenceModule, mockThreatReport } from "./nova-nexus-threat-intel/src";

export default function ThreatIntelPage() {
  return <ThreatIntelligenceModule state="success" report={mockThreatReport} />;
}
```

To see all four UI states (loading / empty / error / success) and both the
flagged and clean mock cases in one screen, use the demo harness instead:

```tsx
import { ThreatIntelligenceDemo } from "./nova-nexus-threat-intel/src/ThreatIntelligenceDemo";

export default function DemoPage() {
  return <ThreatIntelligenceDemo />;
}
```

### Props

`ThreatIntelligenceModule` accepts:

| Prop | Type | Description |
|---|---|---|
| `state` | `"loading" \| "empty" \| "error" \| "success"` | Drives which top-level UI renders. Defaults to `"success"`. |
| `report` | `ThreatIntelligenceReport` | Required when `state === "success"`. |
| `onRetry` | `() => void` | Called from the error state's "Retry analysis" button. |
| `onSelectCase` | `() => void` | Called from the empty state's call-to-action button (optional). |

## Backend integration (for later)

Everything the UI needs is defined by the `ThreatIntelligenceReport` interface
in `src/types/threatIntel.types.ts`. When the AI detection backend is ready:

1. Have your API return JSON shaped like `ThreatIntelligenceReport`
   (see `mockThreatReport` in `src/data/mockThreatData.ts` for a full example).
2. Fetch it in your page/container component, track `loading` / `error` /
   `success` / `empty` yourself (e.g. with `useState`/`useEffect` or your data
   layer of choice), and pass the result straight into
   `<ThreatIntelligenceModule state={...} report={...} />`.
3. No component in this module needs to change — they are all pure/presentational.

### Threat map visualization

`ThreatMapVisualization.tsx` renders a stylized SVG "map" (dotted texture,
graticule lines, glowing hop markers, animated dashed routing path) using a
simple equirectangular lat/long projection — **no external map API or tile
assets**, so it works fully offline for the demo. It consumes
`ThreatOriginNode[]` (`latitude`, `longitude`, `severity`, `hopOrder`, etc.),
which is already the shape most real map SDKs (Leaflet, Mapbox GL JS, Google
Maps) expect for markers and polylines — so swapping in a real interactive
map later only means replacing this one component's internals, not the data
contract.

## Design system notes (for consistency across future modules)

- **Palette:** near-black navy background (`#040810`), slate-900/800 card
  surfaces, cyan-400 as the single primary accent. Severity and reputation
  each have a fixed color mapping — see `src/theme/socTheme.ts`
  (`severityStyles`, `reputationStyles`). Reuse these two maps in any new
  module instead of re-declaring colors, so "critical" always looks the same
  everywhere in Nova Nexus.
- **Cards:** `surfaceCard` class from `socTheme.ts` (rounded-xl, subtle
  border, translucent dark fill) is the base for every card in this module —
  reuse it for new modules too.
- **Typography:** system sans for UI text, monospace for IPs/hashes/domains/
  timestamps (`monoValue` helper), uppercase tracked-out labels for section
  headings (`sectionHeading` helper).
- **Icons:** `lucide-react` only, sized `h-4 w-4` for section headers and
  `h-3 w-3` / `h-3.5 w-3.5` for inline badges.

## States

| State | Component | Trigger |
|---|---|---|
| Loading | `LoadingState` | Skeleton placeholders + spinner while a scan is running |
| Empty | `EmptyState` | No case selected yet |
| Error | `ErrorState` | Analysis lookup failed; offers a retry action |
| Success | full dashboard | Renders all cards from `ThreatIntelligenceReport` |

## Validation performed

- Type-checked with the TypeScript compiler (strict mode) against this
  module's own source — no type errors, no unused imports/params, no
  implicit `any`.
- All imports resolve within the module (no broken relative paths); the only
  external packages referenced are `react`, `lucide-react`, and `recharts`.
- Manually reviewed for consistent prop typing, key usage in lists, and
  null/optional handling (e.g. `replyTo`, `similarityToKnownBrand`,
  `lastReportedAt` can be `null` and are handled in the UI).

Since this deliverable intentionally excludes `package.json` / build config,
a full `npm run build` could not be executed here — run one inside your host
app after dropping this module in, using the dependency versions above.

## Not included (by design, per brief)

- No backend/API code, no real threat-intel or geolocation API calls.
- No `package.json`, `vite.config`, `tsconfig.json`, `index.html`,
  `node_modules`, or lockfiles — this is a source-only module for an
  existing project.
