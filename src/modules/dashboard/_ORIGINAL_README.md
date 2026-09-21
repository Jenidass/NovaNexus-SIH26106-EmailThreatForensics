# Nova Nexus — Security Dashboard Module

**SIH26106** — AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence Platform

This folder contains only the **Dashboard module's source**: React + TypeScript
components, mock data, types, and styles. There is intentionally **no**
`package.json`, `tsconfig.json`, `vite.config`, or `index.html` — drop this
folder into your existing (or teammate's) Vite/CRA/Next project and wire it up
in a few minutes using the steps below. It was built and verified inside a
throwaway Vite + React + TS + Tailwind scaffold to confirm zero TypeScript
errors and a clean production build; that scaffold is not part of this
delivery.

---

## 1. What's inside

```
nova-nexus-dashboard/
├── README.md
├── tailwind.theme.snippet.js        # merge into your tailwind.config.js
└── src/
    ├── index.ts                     # barrel export — import everything from here
    ├── types/threat.types.ts        # domain model (Investigation, ThreatOrigin, ...)
    ├── data/mockData.ts             # realistic mock dataset (no backend needed)
    ├── theme/severity.ts            # single source of truth for severity/status colors
    ├── utils/format.ts              # number/date formatting helpers
    ├── hooks/useDashboardData.ts    # simulated async data hook (loading/success/error/empty)
    ├── styles/globals.css           # Tailwind directives + fonts + base theme
    └── components/
        ├── ui/                      # Card, Badge, Skeleton, EmptyState, ErrorState
        └── dashboard/
            ├── Dashboard.tsx                 # composed page — default export, drop into a route
            ├── DashboardHeader.tsx            # security overview header
            ├── StatGrid.tsx / StatCard.tsx    # 5 headline metrics
            ├── ThreatSeverityChart.tsx        # severity donut chart
            ├── ThreatCategoryChart.tsx        # category bar chart
            ├── RecentInvestigationsTable.tsx  # investigations table
            ├── SecurityActivityTimeline.tsx   # activity/event timeline
            ├── ThreatOriginMap.tsx            # GeoLocation radar preview
            └── DemoModeSwitcher.tsx           # demo-only: toggle success/empty/error
```

## 2. Requirements

Your host project needs these dependencies (versions used during
verification — any compatible range works):

```
react ^18 || ^19
react-dom ^18 || ^19
typescript ^5
tailwindcss ^3
lucide-react ^0.3
recharts ^2
```

Install whichever are missing:

```bash
npm install lucide-react recharts
npm install -D tailwindcss postcss autoprefixer
```

## 3. Integration steps

1. **Copy the folder** into your project, e.g. `src/modules/nova-nexus-dashboard/`
   (or directly merge its `src/*` into your own `src/`).

2. **Merge the Tailwind theme.** Open `tailwind.theme.snippet.js` for the
   exact merge instructions — it adds the `Inter` / `JetBrains Mono` font
   stack. Make sure your `tailwind.config.js` `content` globs include this
   folder, e.g.:

   ```js
   content: ["./index.html", "./src/**/*.{ts,tsx}"]
   ```

3. **Import the global stylesheet once**, at your app's entry point:

   ```tsx
   import "./modules/nova-nexus-dashboard/src/styles/globals.css";
   ```

4. **Render the dashboard** on a route:

   ```tsx
   import Dashboard from "./modules/nova-nexus-dashboard/src/components/dashboard/Dashboard";

   export default function DashboardPage() {
     return <Dashboard />;
   }
   ```

   Or import individual pieces via the barrel file for a custom layout:

   ```tsx
   import { StatGrid, ThreatSeverityChart, useDashboardData } from
     "./modules/nova-nexus-dashboard/src";
   ```

That's it — the module is self-contained and works immediately with mock
data, no API keys or backend required.

## 4. Wiring a real backend later

Every panel consumes the same shape: `AsyncState<DashboardSnapshot>` from
`src/types/threat.types.ts`. To connect a real API:

1. Replace the body of `useDashboardData` (`src/hooks/useDashboardData.ts`)
   with a `fetch()`/`axios` call to your endpoint (e.g.
   `GET /api/dashboard/summary`), returning data shaped like
   `DashboardSnapshot`.
2. Keep returning `{ status, data, error, refetch }` — no component below
   the hook needs to change.
3. Delete `DemoModeSwitcher.tsx` and its usage in `Dashboard.tsx` once you no
   longer need to demo loading/empty/error states manually.

## 5. Design system notes (reused across future modules)

- **Palette**: near-black navy surfaces (`#070B14` → `#0B1120`), 1px
  `slate-800` borders, cyan (`#22d3ee`) as the primary accent. Severity
  colors (critical/high/medium/low/info) are centralized in
  `src/theme/severity.ts` — reuse that map in GeoLocation, Forensics, and
  any other module so severity color-coding stays consistent app-wide.
- **Type**: Inter for UI text, JetBrains Mono for all numeric/data readouts
  (stat values, timestamps, IPs, confidence scores) — a small but deliberate
  choice that reinforces the "console/telemetry" feel of a SOC tool.
- **Card primitive**: `src/components/ui/Card.tsx` (`Card` + `CardHeader`)
  is the one panel component every future module should build on, so all
  screens share identical corner radius, border, and padding.
- **Signature element**: the animated radar sweep in `ThreatOriginMap.tsx`
  — a dependency-free SVG "threat radar" (no map-tile API required) that
  plots origin countries by incident volume. A future GeoLocation module can
  swap this for a full interactive map while keeping the same
  `AsyncState<DashboardSnapshot>` input contract.

## 6. States

Every data panel independently handles four states driven by
`useDashboardData`:

- **Loading** — skeleton placeholders (`src/components/ui/Skeleton.tsx`)
- **Success** — normal charts/table/timeline
- **Empty** — `EmptyState` with contextual copy per panel
- **Error** — `ErrorState` with a Retry button wired to `refetch()`

Use the **"Live data / Empty state / Error state"** switcher at the top of
the dashboard (visible in the running app) to demo all four states without
touching a backend — useful for the SIH jury walkthrough.

## 7. Verification performed before delivery

- `tsc --noEmit` — zero TypeScript errors
- `vite build` — production build completes successfully
- No broken imports; barrel file (`src/index.ts`) exports every public piece
- Responsive layout checked at desktop/laptop breakpoints (grid collapses
  gracefully from 5 → 2 → 1 columns)
