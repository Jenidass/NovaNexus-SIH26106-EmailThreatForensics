export type Severity = 'SAFE' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL';

export type SignalStatus = 'PASS' | 'WARN' | 'FAIL';

export interface CaseSummary {
  caseId: string;
  threat: string;
  threatScore: number; // 0-100
  confidence: number; // 0-100
  severity: Severity;
  openedAt: string;
  analyst: string;
  status: 'OPEN' | 'IN_REVIEW' | 'CLOSED';
}

export interface DetectedSignal {
  id: string;
  label: string;
  description: string;
  status: SignalStatus;
  weight: number; // contribution to score, 0-100
  category: 'Content' | 'Header' | 'Authentication' | 'URL' | 'Infrastructure';
}

export interface RiskCategory {
  category: string;
  score: number; // 0-100
  color: 'teal' | 'amber' | 'red' | 'green';
}

export interface Recommendation {
  id: string;
  action: string;
  detail: string;
  priority: 'IMMEDIATE' | 'RECOMMENDED' | 'OPTIONAL';
}

export interface EmailHeaderField {
  name: string;
  value: string;
  flagged?: boolean;
  note?: string;
}

export interface AuthCheck {
  protocol: 'SPF' | 'DKIM' | 'DMARC';
  result: 'PASS' | 'FAIL' | 'NEUTRAL' | 'NONE';
  detail: string;
  domain: string;
}

export interface SuspiciousUrl {
  id: string;
  url: string;
  displayText: string;
  riskScore: number;
  verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'CLEAN';
  reasons: string[];
  redirectChain: string[];
}

export interface InfraNode {
  id: string;
  label: string;
  type: 'sender-ip' | 'mail-server' | 'redirect' | 'hosting' | 'registrar';
  value: string;
  location: string;
  reputation: 'MALICIOUS' | 'POOR' | 'NEUTRAL' | 'GOOD';
  asn?: string;
  firstSeen?: string;
}

export interface AiFinding {
  id: string;
  summary: string;
  detail: string;
  confidence: number;
}
