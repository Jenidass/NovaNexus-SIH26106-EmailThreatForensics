/**
 * Nova Nexus — Core domain types
 * SIH26106 — AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence Platform
 *
 * These types are intentionally backend-agnostic: swap the mock data source
 * (src/data/mockData.ts) for a real API response shaped like this and every
 * component in src/components/dashboard keeps working unchanged.
 */

export type ThreatSeverity = "critical" | "high" | "medium" | "low" | "info";

export type ThreatCategory =
  | "Phishing"
  | "Business Email Compromise"
  | "Malware Attachment"
  | "Spoofing"
  | "Credential Harvesting"
  | "Ransomware Link"
  | "Spam";

export type InvestigationStatus =
  | "open"
  | "in_review"
  | "escalated"
  | "resolved"
  | "false_positive";

export interface StatMetric {
  id: string;
  label: string;
  value: number;
  /** Percentage change vs. previous period, e.g. 12.4 or -3.2 */
  delta: number;
  trend: "up" | "down" | "flat";
  /** Short helper copy shown under the label */
  caption: string;
}

export interface SeverityBreakdown {
  severity: ThreatSeverity;
  count: number;
}

export interface CategoryBreakdown {
  category: ThreatCategory;
  count: number;
}

export interface Investigation {
  id: string;
  caseRef: string;
  subject: string;
  sender: string;
  senderDomain: string;
  recipient: string;
  severity: ThreatSeverity;
  category: ThreatCategory;
  status: InvestigationStatus;
  confidenceScore: number; // 0-100, model confidence
  originCountry: string;
  originIp: string;
  detectedAt: string; // ISO timestamp
  analyst: string;
}

export type ActivityEventType =
  | "detection"
  | "escalation"
  | "resolution"
  | "forensic_scan"
  | "geo_flag"
  | "system";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  timestamp: string; // ISO timestamp
  severity?: ThreatSeverity;
  actor: string;
}

export interface ThreatOrigin {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lng: number;
  incidentCount: number;
  severity: ThreatSeverity;
}

export interface DashboardSnapshot {
  stats: StatMetric[];
  severityBreakdown: SeverityBreakdown[];
  categoryBreakdown: CategoryBreakdown[];
  investigations: Investigation[];
  activity: ActivityEvent[];
  origins: ThreatOrigin[];
  generatedAt: string;
}

/** Generic async resource state used by the data hook and every panel. */
export interface AsyncState<T> {
  status: "loading" | "success" | "error" | "empty";
  data: T | null;
  error: string | null;
}
