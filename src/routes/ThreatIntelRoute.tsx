import { useEffect, useState } from "react";
import {
  getInvestigation,
  mapInvestigationToThreatIntel,
} from "../api/threatIntel";
import { ThreatIntelligenceModule } from "../modules/threat-intel";
import type { ThreatIntelligenceReport } from "../modules/threat-intel/types/threatIntel.types";

export default function ThreatIntelRoute() {
  const [state, setState] = useState<
    "loading" | "success" | "error" | "empty"
  >("loading");

  const [report, setReport] =
    useState<ThreatIntelligenceReport | null>(null);

  useEffect(() => {
    async function loadThreatIntel() {
      try {
        setState("loading");

        /*
         * For now we use the latest investigation returned
         * by the backend.
         *
         * Later this can come directly from the selected
         * investigation/case ID.
         */
        const investigations = await getInvestigationList();

        if (!investigations.length) {
          setState("empty");
          return;
        }

        const latestInvestigation =
          investigations[0];

        const data = await getInvestigation(
          latestInvestigation.id
        );

        const mappedReport =
          mapInvestigationToThreatIntel(data);

        setReport(mappedReport);
        setState("success");

      } catch (error) {
        console.error(
          "Failed to load threat intelligence:",
          error
        );

        setState("error");
      }
    }

    loadThreatIntel();
  }, []);

  if (state === "loading") {
    return (
      <ThreatIntelligenceModule
        state="loading"
      />
    );
  }

  if (state === "empty") {
    return (
      <ThreatIntelligenceModule
        state="empty"
      />
    );
  }

  if (state === "error") {
    return (
      <ThreatIntelligenceModule
        state="error"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <ThreatIntelligenceModule
      state="success"
      report={report ?? undefined}
    />
  );
}

/**
 * Get all investigations so that the route can select
 * the latest available case.
 */
async function getInvestigationList(): Promise<any[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/emails"
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch investigations: ${response.status}`
    );
  }

  return response.json();
}
