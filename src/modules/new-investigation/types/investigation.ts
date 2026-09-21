// Core types for the New Investigation module

export type InvestigationStage =
  | 'idle'
  | 'file-selected'
  | 'processing'
  | 'complete'
  | 'error';

export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'clean';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: File;
}
export interface EmailMetadata {
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  date: string;
  messageId: string;
  returnPath: string;
  spf: 'pass' | 'fail' | 'neutral' | 'none';
  dkim: 'pass' | 'fail' | 'neutral' | 'none';
  dmarc: 'pass' | 'fail' | 'neutral' | 'none';
  attachmentCount: number;
  hopCount: number;
}

export interface AnalysisStep {
  id: string;
  label: string;
  detail: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  durationMs?: number;
}

export interface ThreatScore {
  overall: number; // 0-100
  level: ThreatLevel;
  headerRisk: number;
  contentRisk: number;
  linkRisk: number;
  attachmentRisk: number;
  reputationRisk: number;
}

export interface SenderInfo {
  displayName: string;
  address: string;
  domain: string;
  domainAgeDays: number;
  spoofed: boolean;
  freeMailProvider: boolean;
  previousReports: number;
  organization?: string;
}

export interface NetworkInfo {
  ip: string;
  country: string;
  city: string;
  isp: string;
  asn: string;
  latitude: number;
  longitude: number;
  blacklisted: boolean;
  vpnOrProxy: boolean;
}

export interface SuspiciousLink {
  id: string;
  url: string;
  displayText: string;
  riskLevel: ThreatLevel;
  reason: string;
  redirectsTo?: string;
}

export interface SuspiciousAttachment {
  id: string;
  fileName: string;
  fileType: string;
  sizeKb: number;
  riskLevel: ThreatLevel;
  reason: string;
  hash: string;
}

export type IOCType = 'ip' | 'domain' | 'url' | 'hash' | 'email';

export interface IOC {
  id: string;
  type: IOCType;
  value: string;
  confidence: number; // 0-100
  source: string;
  firstSeen: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  severity: ThreatLevel;
  category: 'header' | 'content' | 'link' | 'attachment' | 'network' | 'authentication';
}

export interface InvestigationResult {
  id: string;
  fileName: string;
  completedAt: string;
  metadata: EmailMetadata;
  threatScore: ThreatScore;
  sender: SenderInfo;
  network: NetworkInfo;
  suspiciousLinks: SuspiciousLink[];
  suspiciousAttachments: SuspiciousAttachment[];
  iocs: IOC[];
  evidence: EvidenceItem[];
  verdict: string;
  recommendedAction: string;
}
