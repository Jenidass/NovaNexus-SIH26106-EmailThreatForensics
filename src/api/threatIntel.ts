import { apiFetch } from "./client";
import type {
  ThreatIntelligenceReport,
  SeverityLevel,
  ReputationStatus,
} from "../modules/threat-intel/types/threatIntel.types";

export async function getInvestigation(
  investigationId: string
): Promise<any> {
  return apiFetch<any>(
    `/api/emails/${encodeURIComponent(investigationId)}`
  );
}

export async function getThreatIntelligence(
  indicatorType: string,
  value: string
): Promise<any> {
  return apiFetch<any>(
    `/api/threat-intel/${encodeURIComponent(indicatorType)}/${encodeURIComponent(value)}`
  );
}

/**
 * Converts the existing FastAPI Investigation response
 * into the data structure expected by the Threat Intelligence UI.
 */
export function mapInvestigationToThreatIntel(
  data: any
): ThreatIntelligenceReport {

  const severity =
    normalizeSeverity(data.severity);

  const reputation =
    normalizeReputation(data.severity);

  const indicators = (data.indicators ?? []).map(
    (indicator: any, index: number) => ({
      id: `ioc-${index + 1}`,
      type: normalizeIndicatorType(indicator.type),
      value: indicator.value,
      reputation,
      confidence: riskToConfidence(indicator.risk),
      firstSeen: data.timestamp ?? new Date().toISOString(),
      tags: [indicator.risk],
    })
  );

  const ip = data.ip || "Unknown";

  return {
    caseId: data.id,
    emailSubject: data.subject || "Unknown Subject",
    receivedAt:
      data.timestamp || new Date().toISOString(),

    threatScore: {
      score: Number(data.threat_score ?? 0),
      classification:
        normalizeClassification(data.category),
      severity,
      confidence:
        calculateConfidence(data.threat_score),
      lastAnalyzed:
        data.timestamp || new Date().toISOString(),
      modelVersion: "Nova Nexus Heuristic Engine v1.0",
    },

    ipAnalysis: {
      address: ip,
      reputation,
      abuseConfidenceScore:
        Number(data.threat_score ?? 0),
      isTor: false,
      isProxy: false,
      isVpn: false,
      isDatacenter: false,
      totalReports: 0,
      lastReportedAt: null,
      firstSeen:
        data.timestamp || new Date().toISOString(),
      blacklists: [],
    },

    domainAnalysis: {
      domain: data.domain || "Unknown",
      reputation,
      registrar: "Unknown",
      createdOn:
        data.timestamp || new Date().toISOString(),
      ageInDays: 0,
      isNewlyRegistered: false,
      hasValidSpf: true,
      hasValidDkim: true,
      hasValidDmarc: true,
      sslValid: true,
      similarityToKnownBrand: null,
    },

    senderInfo: {
      displayName:
        extractDisplayName(data.sender),
      emailAddress:
        data.sender || "Unknown",
      replyTo: null,
      spoofed:
        severity === "critical" ||
        severity === "high",
      firstTimeContact: false,
      historicalMessageCount: 0,
      organization: null,
    },

    indicators,

    geoLocation: {
      ip,
      country: data.country || "Unknown",
      countryCode: "",
      region: "",
      city: data.city || "Unknown",
      latitude: 0,
      longitude: 0,
      timezone: "",
      asn: {
        asn: data.asn || "Unknown",
        isp: data.isp || "Unknown",
        organization: data.isp || "Unknown",
      },
      isHighRiskRegion: severity === "critical",
    },

    threatOriginPath: [],

    relatedIndicators: [],
  };
}

/* =========================================================
   HELPERS
   ========================================================= */

function normalizeSeverity(
  value: any
): SeverityLevel {

  const severity =
    String(value ?? "")
      .toLowerCase();

  if (severity === "critical")
    return "critical";

  if (severity === "high")
    return "high";

  if (severity === "medium")
    return "medium";

  if (severity === "low")
    return "low";

  return "info";
}

function normalizeReputation(
  value: any
): ReputationStatus {

  const severity =
    String(value ?? "")
      .toLowerCase();

  if (severity === "critical")
    return "malicious";

  if (severity === "high")
    return "suspicious";

  if (severity === "medium")
    return "suspicious";

  return "clean";
}

function normalizeIndicatorType(
  value: any
): "ip" | "domain" | "url" | "hash" | "email" {

  const type =
    String(value ?? "")
      .toLowerCase();

  if (
    type === "ip" ||
    type === "domain" ||
    type === "url" ||
    type === "hash" ||
    type === "email"
  ) {
    return type;
  }

  return "domain";
}

function normalizeClassification(
  value: any
): any {

  const category =
    String(value ?? "")
      .toLowerCase();

  if (category.includes("phish"))
    return "Phishing";

  if (
    category.includes("malware") ||
    category.includes("attachment")
  )
    return "Malware Delivery";

  if (category.includes("spoof"))
    return "Spoofing";

  if (category.includes("spam"))
    return "Spam";

  if (
    category.includes("credential") ||
    category.includes("login")
  )
    return "Credential Harvesting";

  if (
    category.includes("business") ||
    category.includes("bec")
  )
    return "Business Email Compromise";

  return "Clean";
}

function riskToConfidence(
  risk: any
): number {

  const value =
    String(risk ?? "")
      .toLowerCase();

  if (value === "critical")
    return 95;

  if (value === "high")
    return 85;

  if (value === "medium")
    return 70;

  return 50;
}

function calculateConfidence(
  score: any
): number {

  const numericScore =
    Number(score ?? 0);

  return Math.max(
    50,
    Math.min(99, numericScore)
  );
}

function extractDisplayName(
  sender: string
): string {

  if (!sender)
    return "Unknown";

  const match =
    sender.match(/^(.+?)\s*<.+>$/);

  if (match)
    return match[1].trim();

  return sender;
}
