/**
 * Nova Nexus — Threat Intelligence & GeoLocation Module
 * Type definitions
 *
 * These types model the shape of data this module expects to receive
 * from the AI-Powered Email Threat Detection backend (SIH26106).
 * Replace the mock data source with a live API response that conforms
 * to these interfaces and the UI will work unchanged.
 */

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

export type ThreatClassification =
  | "Phishing"
  | "Business Email Compromise"
  | "Malware Delivery"
  | "Spoofing"
  | "Spam"
  | "Credential Harvesting"
  | "Clean";

export type ReputationStatus =
  | "malicious"
  | "suspicious"
  | "unverified"
  | "clean";

export type IndicatorType = "ip" | "domain" | "url" | "hash" | "email";

/** Async request lifecycle used to drive loading / empty / error / success UI states */
export type RequestState = "loading" | "empty" | "error" | "success";

export interface ThreatScore {
  /** 0 - 100, higher = more dangerous */
  score: number;
  classification: ThreatClassification;
  severity: SeverityLevel;
  confidence: number; // 0 - 100
  lastAnalyzed: string; // ISO timestamp
  modelVersion: string;
}

export interface IpAnalysis {
  address: string;
  reputation: ReputationStatus;
  abuseConfidenceScore: number; // 0 - 100
  isTor: boolean;
  isProxy: boolean;
  isVpn: boolean;
  isDatacenter: boolean;
  totalReports: number;
  lastReportedAt: string | null;
  firstSeen: string;
  blacklists: { name: string; listed: boolean }[];
}

export interface DomainAnalysis {
  domain: string;
  reputation: ReputationStatus;
  registrar: string;
  createdOn: string; // ISO date
  ageInDays: number;
  isNewlyRegistered: boolean;
  hasValidSpf: boolean;
  hasValidDkim: boolean;
  hasValidDmarc: boolean;
  sslValid: boolean;
  similarityToKnownBrand: {
    brand: string;
    similarityScore: number; // 0 - 100
  } | null;
}

export interface SenderInfo {
  displayName: string;
  emailAddress: string;
  replyTo: string | null;
  spoofed: boolean;
  firstTimeContact: boolean;
  historicalMessageCount: number;
  organization: string | null;
}

export interface IndicatorOfCompromise {
  id: string;
  type: IndicatorType;
  value: string;
  reputation: ReputationStatus;
  confidence: number; // 0 - 100
  firstSeen: string;
  tags: string[];
}

export interface GeoAsn {
  asn: string;
  isp: string;
  organization: string;
}

export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  asn: GeoAsn;
  isHighRiskRegion: boolean;
}

export interface ThreatOriginNode {
  id: string;
  ip: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  severity: SeverityLevel;
  hopOrder: number;
  label: string;
}

export interface RelatedIndicator {
  id: string;
  value: string;
  type: IndicatorType;
  relation: string; // e.g. "Shared infrastructure", "Same campaign"
  severity: SeverityLevel;
  seenInCampaigns: number;
}

export interface ThreatIntelligenceReport {
  caseId: string;
  emailSubject: string;
  receivedAt: string; // ISO timestamp
  threatScore: ThreatScore;
  ipAnalysis: IpAnalysis;
  domainAnalysis: DomainAnalysis;
  senderInfo: SenderInfo;
  indicators: IndicatorOfCompromise[];
  geoLocation: GeoLocation;
  threatOriginPath: ThreatOriginNode[];
  relatedIndicators: RelatedIndicator[];
}
