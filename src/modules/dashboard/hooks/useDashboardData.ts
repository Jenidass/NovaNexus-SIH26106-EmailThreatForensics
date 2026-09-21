import { useCallback, useEffect, useState } from "react";
import type {
  AsyncState,
  DashboardSnapshot,
  StatMetric,
} from "../types/threat.types";

export type DemoMode = "success" | "error" | "empty";

interface UseDashboardDataOptions {
  delayMs?: number;
  mode?: DemoMode;
}

interface BackendDashboardResponse {
  stats: {
    total_investigations: number;
    threats_detected: number;
    high_risk_emails: number;
    critical_threats: number;
    suspicious_indicators: number;
  };
  severity_distribution: Record<string, number>;
  category_distribution: Record<string, number>;
  recent_investigations: any[];
  activity: any[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";


function createStat(
  id: string,
  label: string,
  value: number,
  caption: string
): StatMetric {
  return {
    id,
    label,
    value,
    delta: 0,
    trend: "flat",
    caption,
  };
}

function mapBackendData(
  response: BackendDashboardResponse
): DashboardSnapshot {
  const stats: StatMetric[] = [
    createStat(
      "total-investigations",
      "Total Investigations",
      response.stats.total_investigations,
      "Total forensic investigations"
    ),
    createStat(
      "threats-detected",
      "Threats Detected",
      response.stats.threats_detected,
      "Threats identified by the platform"
    ),
    createStat(
      "high-risk-emails",
      "High Risk Emails",
      response.stats.high_risk_emails,
      "High and critical severity emails"
    ),
    createStat(
      "critical-threats",
      "Critical Threats",
      response.stats.critical_threats,
      "Critical severity threats"
    ),
    createStat(
      "suspicious-indicators",
      "Suspicious Indicators",
      response.stats.suspicious_indicators,
      "Indicators identified during analysis"
    ),
  ];

  const severityBreakdown = Object.entries(
    response.severity_distribution
  ).map(([severity, count]) => ({
    severity: severity as any,
    count,
  }));

  const categoryBreakdown = Object.entries(
    response.category_distribution
  ).map(([category, count]) => ({
    category: category as any,
    count,
  }));

  return {
    stats,
    severityBreakdown,
    categoryBreakdown,
    investigations: response.recent_investigations,
    activity: response.activity,
    origins: [],
    generatedAt: new Date().toISOString(),
  };
}

export function useDashboardData({
  delayMs = 0,
  mode = "success",
}: UseDashboardDataOptions = {}): AsyncState<DashboardSnapshot> & {
  refetch: () => void;
} {
  const [state, setState] = useState<AsyncState<DashboardSnapshot>>({
    status: "loading",
    data: null,
    error: null,
  });

  const [attempt, setAttempt] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;

    setState({
      status: "loading",
      data: null,
      error: null,
    });

    const fetchData = async () => {
      try {
        if (mode === "error") {
          throw new Error("Demo error mode");
        }

        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        const response = await fetch(
          `${API_BASE_URL}/api/dashboard/overview`
        );

        if (!response.ok) {
          throw new Error(
            `Dashboard API returned ${response.status}`
          );
        }

        const backendData =
          (await response.json()) as BackendDashboardResponse;

        if (cancelled) return;

        const dashboardData = mapBackendData(backendData);

        const isEmpty =
          dashboardData.investigations.length === 0 &&
          dashboardData.stats.every((stat) => stat.value === 0);

        setState({
          status: isEmpty ? "empty" : "success",
          data: dashboardData,
          error: null,
        });
      } catch (error) {
        if (cancelled) return;

        setState({
          status: "error",
          data: null,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load dashboard data.",
        });
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [mode, delayMs]);

  useEffect(() => {
    return load();
  }, [load, attempt]);

  const refetch = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  return {
    ...state,
    refetch,
  };
}