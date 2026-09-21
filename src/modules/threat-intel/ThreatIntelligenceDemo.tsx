import React, { useState } from "react";
import type { RequestState } from "./types/threatIntel.types";
import { ThreatIntelligenceModule } from "./ThreatIntelligenceModule";
import { mockThreatReport, mockCleanThreatReport } from "./data/mockThreatData";

type DemoDataset = "phishing" | "clean";

const demoStates: { key: RequestState; label: string }[] = [
  { key: "loading", label: "Loading" },
  { key: "empty", label: "Empty" },
  { key: "error", label: "Error" },
  { key: "success", label: "Success" },
];

/**
 * Standalone demo harness for presentations / judging rounds.
 * Lets you flip between loading / empty / error / success and between a
 * flagged phishing case and a clean case, without any backend.
 * Not required for integration — `ThreatIntelligenceModule` is the
 * component to embed in the real Nova Nexus shell.
 */
export const ThreatIntelligenceDemo: React.FC = () => {
  const [state, setState] = useState<RequestState>("success");
  const [dataset, setDataset] = useState<DemoDataset>("phishing");

  const report = dataset === "phishing" ? mockThreatReport : mockCleanThreatReport;

  return (
    <div className="min-h-screen bg-[#040810]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/80 px-6 py-3">
        <span className="mr-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Demo controls
        </span>
        {demoStates.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setState(s.key)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              state === s.key
                ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-inset ring-cyan-500/30"
                : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
            }`}
          >
            {s.label}
          </button>
        ))}

        <span className="mx-2 h-4 w-px bg-slate-800" />

        <button
          type="button"
          onClick={() => setDataset("phishing")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            dataset === "phishing"
              ? "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"
              : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
          }`}
        >
          Phishing case
        </button>
        <button
          type="button"
          onClick={() => setDataset("clean")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            dataset === "clean"
              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
              : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
          }`}
        >
          Clean case
        </button>
      </div>

      <ThreatIntelligenceModule
        state={state}
        report={report}
        onRetry={() => setState("success")}
        onSelectCase={() => setState("success")}
      />
    </div>
  );
};

export default ThreatIntelligenceDemo;
