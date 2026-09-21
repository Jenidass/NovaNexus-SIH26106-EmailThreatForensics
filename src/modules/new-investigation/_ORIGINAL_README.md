# Nova Nexus — New Investigation Module

Frontend-only "New Email Investigation" module for **SIH26106 — AI-Powered
Email Threat Detection, GeoLocation and Forensic Intelligence Platform**.

Dark navy/black SOC theme, cyan-blue accents, fully working upload →
processing → analysis → results demo flow, all on mock data. No backend,
no real AI, no external API calls.

## What's inside

```
src/
  types/investigation.ts          all shared TypeScript types
  data/mockInvestigation.ts       mock scenarios + result generator
  styles/theme.css                theme CSS variables (reuse across modules)
  components/ui/                  reusable primitives (Card, Button, Badge, ProgressBar, empty/error states)
  components/investigation/
    NewInvestigationPage.tsx      orchestrates the whole flow (state machine)
    UploadZone.tsx                drag & drop + click upload, validation, error state
    FileDetailsCard.tsx           file metadata after selection
    ProcessingView.tsx            6-step animated pipeline + progress bar
    AnalysisLog.tsx                terminal-style live log
    ThreatScoreCard.tsx            radial gauge + risk breakdown (Recharts)
    SenderInfoCard.tsx             sender identity / spoofing signals
    NetworkInfoCard.tsx            IP / ASN / geolocation
    SuspiciousLinksCard.tsx        suspicious links + attachments
    IOCTable.tsx                   indicators of compromise table
    EvidenceFindings.tsx           evidence timeline
    CompletionBanner.tsx           final verdict + export/new investigation actions
  App.tsx                         example shell (sidebar + page) — reference only
```

## Integrating into your existing Vite project

This module ships as source only — no `package.json`, `vite.config`,
`tsconfig`, or `index.html`, since those already exist in your project.

1. **Copy folders in.** Drop `src/types`, `src/data`, `src/styles`, and
   `src/components` into your existing `src/` (merge, don't overwrite,
   if you already have folders with those names).

2. **Install dependencies** (skip any you already have):
   ```
   npm install lucide-react recharts
   ```
   Tailwind CSS must already be configured in the host project — this
   module uses Tailwind utility classes plus a handful of CSS variables,
   no Tailwind config changes are required.

3. **Import the theme once**, near your app root (e.g. in `main.tsx` or
   your root layout), after Tailwind's base styles:
   ```ts
   import './styles/theme.css';
   ```

4. **Render the page:**
   ```tsx
   import { NewInvestigationPage } from './components/investigation/NewInvestigationPage';

   <NewInvestigationPage />
   ```
   `App.tsx` in this package shows one way to wrap it in a sidebar shell —
   treat it as a reference, not a required file. Feel free to delete it if
   your project already has its own shell/router.

## Design system for reuse in other modules

All colors, radii and fonts are CSS variables defined in `styles/theme.css`
(`--nx-bg`, `--nx-surface`, `--nx-cyan`, `--nx-critical`, etc.) and consumed
through Tailwind's arbitrary-value syntax, e.g. `bg-[var(--nx-surface)]`.
Reuse the same variables and the `components/ui/` primitives (`Card`,
`Button`, `ThreatBadge`, `ProgressBar`, `EmptyState`, `ErrorPanel`) in any
other SOC module so every screen stays visually consistent.

## Demo flow

| Stage | What happens |
|---|---|
| **Idle** | Empty state with drag-and-drop / click-to-browse upload zone. Rejects unsupported file types and files over 25MB with an inline error. |
| **File selected** | Shows file metadata (name, size, type, modified date) and a "Start Investigation" button. |
| **Processing** | Animated 6-step pipeline (Parse Email → Analyze Headers → Check Authentication → Extract Indicators → Threat Analysis → Generate Report) with a progress bar and a live terminal-style log. |
| **Complete** | Full results: threat score gauge, sender info, IP/geolocation, suspicious links & attachments, IOC table, evidence timeline, and a completion banner with verdict + recommended action. |
| **Error** | ~4% of runs simulate a pipeline failure (for demoing the error state) with a "Try Again" action. Upload validation errors also route through this pattern. |

Each run cycles through three canned scenarios (confirmed phishing, likely
BEC attempt, clean newsletter) so re-running the demo shows different
results without needing a real backend.

## Notes

- Verified with `tsc --noEmit` and a production `vite build` — no type
  errors, no broken imports.
- All data in `data/mockInvestigation.ts` is fictional; IPs, domains and
  hashes are illustrative only.
- Swap `generateInvestigationResult()` for a real API call later — every
  component consumes the same `InvestigationResult` shape, so no component
  changes should be needed when the backend is ready.
