import type {
  CaseSummary,
  DetectedSignal,
  RiskCategory,
  Recommendation,
  EmailHeaderField,
  AuthCheck,
  SuspiciousUrl,
  InfraNode,
  AiFinding,
} from '../types/investigation';

// -----------------------------------------------------------------------
// All data on this page is FICTIONAL and generated for demo purposes only.
// No real senders, domains, IPs, or individuals are represented.
// -----------------------------------------------------------------------

export const caseSummary: CaseSummary = {
  caseId: 'INV-2026-00841',
  threat: 'PHISHING',
  threatScore: 92,
  confidence: 94,
  severity: 'CRITICAL',
  openedAt: '2026-08-27T09:14:02Z',
  analyst: 'Auto-Triage Engine',
  status: 'OPEN',
};

export const detectedSignals: DetectedSignal[] = [
  {
    id: 'sig-01',
    label: 'Suspicious URL',
    description: 'Message contains a link to a domain registered 6 days ago, disguised behind a "Verify Account" button.',
    status: 'FAIL',
    weight: 28,
    category: 'URL',
  },
  {
    id: 'sig-02',
    label: 'Sender / Reply-To mismatch',
    description: 'The visible sender domain does not match the Reply-To address, a common credential-harvesting pattern.',
    status: 'FAIL',
    weight: 22,
    category: 'Header',
  },
  {
    id: 'sig-03',
    label: 'Urgency language',
    description: 'Body text uses high-pressure phrasing ("act within 24 hours", "account will be suspended") designed to short-circuit scrutiny.',
    status: 'WARN',
    weight: 14,
    category: 'Content',
  },
  {
    id: 'sig-04',
    label: 'Authentication failure',
    description: 'SPF and DKIM both fail alignment against the sending domain; DMARC policy was not enforced by the receiving server.',
    status: 'FAIL',
    weight: 20,
    category: 'Authentication',
  },
  {
    id: 'sig-05',
    label: 'Brand impersonation',
    description: 'Visual template closely mimics a known financial institution\'s password-reset email, with logo reused from a public CDN.',
    status: 'WARN',
    weight: 10,
    category: 'Content',
  },
  {
    id: 'sig-06',
    label: 'Newly observed infrastructure',
    description: 'Sending IP has no prior delivery history in this organization\'s mail logs before this message.',
    status: 'WARN',
    weight: 6,
    category: 'Infrastructure',
  },
];

export const riskBreakdown: RiskCategory[] = [
  { category: 'URL & Link Risk', score: 91, color: 'red' },
  { category: 'Authentication', score: 84, color: 'red' },
  { category: 'Content Heuristics', score: 68, color: 'amber' },
  { category: 'Infrastructure', score: 57, color: 'amber' },
  { category: 'Sender Reputation', score: 33, color: 'teal' },
];

export const recommendations: Recommendation[] = [
  {
    id: 'rec-01',
    action: 'Quarantine message across all recipient mailboxes',
    detail: 'Message matches 3 or more high-weight phishing indicators. Recommend immediate quarantine before further triage.',
    priority: 'IMMEDIATE',
  },
  {
    id: 'rec-02',
    action: 'Block sending domain and observed URLs',
    detail: 'Add the redirect domain and its landing-page host to the outbound web-filtering blocklist.',
    priority: 'IMMEDIATE',
  },
  {
    id: 'rec-03',
    action: 'Notify affected recipients',
    detail: 'Send a targeted awareness notice to the 14 mailboxes that received this message before quarantine.',
    priority: 'RECOMMENDED',
  },
  {
    id: 'rec-04',
    action: 'Review DMARC enforcement policy',
    detail: 'Sending domain\'s DMARC policy is set to "none". Recommend the domain owner move to "quarantine" or "reject".',
    priority: 'RECOMMENDED',
  },
  {
    id: 'rec-05',
    action: 'Add indicators to threat intelligence watchlist',
    detail: 'Track this sender IP and domain for 30 days in case of repeat campaign activity.',
    priority: 'OPTIONAL',
  },
];

export const emailMeta = {
  subject: 'Action Required: Verify Your Account Within 24 Hours',
  from: '"Account Security Team" <security-alerts@secure-notify-billing.com>',
  replyTo: 'reply@mail-response-center.ru',
  to: 'finance-team@[recipient-org].com (14 recipients)',
  date: '2026-08-27T08:52:11Z',
  attachments: 0,
  bodyPreview:
    'We detected unusual sign-in activity on your account. To avoid suspension, please verify your identity immediately by clicking the secure link below. Failure to verify within 24 hours will result in permanent account restriction.',
};

export const emailHeaders: EmailHeaderField[] = [
  { name: 'From', value: '"Account Security Team" <security-alerts@secure-notify-billing.com>', flagged: true, note: 'Display name impersonates a generic "security team" persona' },
  { name: 'Reply-To', value: 'reply@mail-response-center.ru', flagged: true, note: 'Different domain entirely from From: address' },
  { name: 'Return-Path', value: 'bounce@secure-notify-billing.com', flagged: false },
  { name: 'Received (final hop)', value: 'from mx09.secure-notify-billing.com (203.0.113.44) by mx.recipient-org.com', flagged: true, note: 'Sending IP has no prior reputation history' },
  { name: 'Message-ID', value: '<a91f3c88-2026-4b21-9e0d-7a1f0c9d33e2@secure-notify-billing.com>', flagged: false },
  { name: 'X-Mailer', value: 'PHPMailer 6.8.0', flagged: false, note: 'Common in bulk / automated send infrastructure' },
  { name: 'Content-Type', value: 'multipart/alternative; boundary="000000000000a1b2c3"', flagged: false },
  { name: 'Subject', value: 'Action Required: Verify Your Account Within 24 Hours', flagged: true, note: 'Urgency framing typical of credential-phishing templates' },
];

export const authChecks: AuthCheck[] = [
  {
    protocol: 'SPF',
    result: 'FAIL',
    domain: 'secure-notify-billing.com',
    detail: 'IP 203.0.113.44 is not listed in the domain\'s SPF record (v=spf1 include:_spf.legit-mailer.example ~all).',
  },
  {
    protocol: 'DKIM',
    result: 'FAIL',
    domain: 'secure-notify-billing.com',
    detail: 'No valid DKIM signature found. Message was sent unsigned.',
  },
  {
    protocol: 'DMARC',
    result: 'NEUTRAL',
    domain: 'secure-notify-billing.com',
    detail: 'Domain publishes p=none, so failing SPF/DKIM did not trigger rejection or quarantine at the receiving server.',
  },
];

export const suspiciousUrls: SuspiciousUrl[] = [
  {
    id: 'url-01',
    url: 'https://secure-notify-billing.com/verify/session?id=8841',
    displayText: 'Verify My Account',
    riskScore: 96,
    verdict: 'MALICIOUS',
    reasons: [
      'Domain registered 6 days before send date',
      'Hosted on infrastructure previously linked to credential-harvesting kits',
      'Page mimics a known banking login form',
    ],
    redirectChain: [
      'secure-notify-billing.com/verify/session?id=8841',
      'track.mail-response-center.ru/r/8841',
      'auth-billing-secure.top/login',
    ],
  },
  {
    id: 'url-02',
    url: 'https://secure-notify-billing.com/unsubscribe',
    displayText: 'Unsubscribe',
    riskScore: 41,
    verdict: 'SUSPICIOUS',
    reasons: ['Same parent domain as the primary phishing link', 'No verifiable list-management infrastructure'],
    redirectChain: ['secure-notify-billing.com/unsubscribe'],
  },
  {
    id: 'url-03',
    url: 'https://cdn.staticassets-lib.net/logo/bank-mark.png',
    displayText: '(embedded image)',
    riskScore: 18,
    verdict: 'CLEAN',
    reasons: ['Publicly hosted static asset, used for brand impersonation but not independently malicious'],
    redirectChain: ['cdn.staticassets-lib.net/logo/bank-mark.png'],
  },
];

export const infraNodes: InfraNode[] = [
  {
    id: 'node-01',
    label: 'Sending IP',
    type: 'sender-ip',
    value: '203.0.113.44',
    location: 'Bucharest, RO (hosting range)',
    reputation: 'POOR',
    asn: 'AS64500 · QuickServe Hosting SRL',
    firstSeen: '2026-08-27',
  },
  {
    id: 'node-02',
    label: 'Sending mail server',
    type: 'mail-server',
    value: 'mx09.secure-notify-billing.com',
    location: 'Bucharest, RO',
    reputation: 'POOR',
    asn: 'AS64500',
  },
  {
    id: 'node-03',
    label: 'Redirect hop',
    type: 'redirect',
    value: 'track.mail-response-center.ru',
    location: 'Unknown / obscured',
    reputation: 'MALICIOUS',
  },
  {
    id: 'node-04',
    label: 'Phishing landing host',
    type: 'hosting',
    value: 'auth-billing-secure.top',
    location: 'Amsterdam, NL (bulletproof hosting)',
    reputation: 'MALICIOUS',
    asn: 'AS398101 · NebulaHost Ltd',
    firstSeen: '2026-08-21',
  },
  {
    id: 'node-05',
    label: 'Domain registrar',
    type: 'registrar',
    value: 'FastDomain Registrations LLC',
    location: 'Panama',
    reputation: 'NEUTRAL',
  },
];

export const aiFindings: AiFinding[] = [
  {
    id: 'ai-01',
    summary: 'Template matches a known "account verification" phishing kit family',
    detail:
      'The layout, button styling, and phrase structure closely match a phishing kit family observed across 40+ prior campaigns in fictional threat-sharing data, typically distributed via compromised bulk-mail relays.',
    confidence: 91,
  },
  {
    id: 'ai-02',
    summary: 'Language model detects coercive urgency framing',
    detail:
      'Two independent phrases ("avoid suspension", "within 24 hours") are structured to reduce recipient deliberation time, a pattern strongly correlated with credential-phishing intent in the model\'s training examples.',
    confidence: 88,
  },
  {
    id: 'ai-03',
    summary: 'Low likelihood of legitimate transactional origin',
    detail:
      'Legitimate account-security notices from the impersonated brand category are not typically sent from newly registered lookalike domains with unsigned DKIM.',
    confidence: 95,
  },
];

export const caseTimeline = [
  { time: '08:52', label: 'Message delivered to 14 mailboxes' },
  { time: '08:53', label: 'Automated triage flagged sender/domain mismatch' },
  { time: '08:54', label: 'URL sandbox detonation completed — malicious verdict' },
  { time: '09:14', label: 'Case INV-2026-00841 opened' },
];
