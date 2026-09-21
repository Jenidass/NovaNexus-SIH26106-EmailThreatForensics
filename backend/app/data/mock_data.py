from datetime import datetime, timedelta


def make_timestamp(minutes_ago: int) -> str:
    return (datetime.now() - timedelta(minutes=minutes_ago)).isoformat()


INVESTIGATIONS = [
    {
        "id": "INV-001",
        "subject": "Urgent Payment Request",
        "sender": "finance-alert@secure-payments.com",
        "recipient": "employee@company.com",
        "status": "completed",
        "severity": "critical",
        "threat_score": 94,
        "category": "Phishing",
        "timestamp": make_timestamp(15),
        "ip": "185.220.101.42",
        "domain": "secure-payments.com",
        "country": "Russia",
        "city": "Moscow",
        "isp": "Example Networks",
        "asn": "AS12345",
        "indicators": [
            {
                "type": "IP",
                "value": "185.220.101.42",
                "risk": "critical",
            },
            {
                "type": "Domain",
                "value": "secure-payments.com",
                "risk": "high",
            },
            {
                "type": "URL",
                "value": "https://secure-payments.com/login",
                "risk": "high",
            },
        ],
        "findings": [
            "Sender domain differs from the claimed organization.",
            "Suspicious authentication URL detected.",
            "IP address has a high-risk reputation.",
        ],
    },
    {
        "id": "INV-002",
        "subject": "Account Verification Required",
        "sender": "support@account-security.net",
        "recipient": "user@company.com",
        "status": "completed",
        "severity": "high",
        "threat_score": 82,
        "category": "Credential Theft",
        "timestamp": make_timestamp(45),
        "ip": "91.240.118.18",
        "domain": "account-security.net",
        "country": "Netherlands",
        "city": "Amsterdam",
        "isp": "Example Hosting",
        "asn": "AS23456",
        "indicators": [
            {
                "type": "IP",
                "value": "91.240.118.18",
                "risk": "high",
            },
            {
                "type": "Domain",
                "value": "account-security.net",
                "risk": "high",
            },
        ],
        "findings": [
            "Credential harvesting pattern detected.",
            "Domain registration appears suspicious.",
        ],
    },
    {
        "id": "INV-003",
        "subject": "Invoice Attached",
        "sender": "billing@vendor-example.com",
        "recipient": "accounts@company.com",
        "status": "completed",
        "severity": "medium",
        "threat_score": 56,
        "category": "Malware",
        "timestamp": make_timestamp(90),
        "ip": "45.155.205.11",
        "domain": "vendor-example.com",
        "country": "Germany",
        "city": "Frankfurt",
        "isp": "Example Telecom",
        "asn": "AS34567",
        "indicators": [
            {
                "type": "IP",
                "value": "45.155.205.11",
                "risk": "medium",
            },
            {
                "type": "Hash",
                "value": "a7f5c21d9e...",
                "risk": "medium",
            },
        ],
        "findings": [
            "Potentially malicious attachment detected.",
            "File hash requires further investigation.",
        ],
    },
    {
        "id": "INV-004",
        "subject": "Security Notification",
        "sender": "security@company-example.com",
        "recipient": "employee@company.com",
        "status": "analyzing",
        "severity": "low",
        "threat_score": 24,
        "category": "Suspicious",
        "timestamp": make_timestamp(130),
        "ip": "8.8.8.8",
        "domain": "company-example.com",
        "country": "United States",
        "city": "Mountain View",
        "isp": "Example ISP",
        "asn": "AS15169",
        "indicators": [],
        "findings": [],
    },
]


ACTIVITY_LOG = [
    {
        "id": "ACT-001",
        "message": "Critical phishing threat detected",
        "investigation_id": "INV-001",
        "severity": "critical",
        "timestamp": make_timestamp(15),
    },
    {
        "id": "ACT-002",
        "message": "Credential theft indicators identified",
        "investigation_id": "INV-002",
        "severity": "high",
        "timestamp": make_timestamp(45),
    },
    {
        "id": "ACT-003",
        "message": "Suspicious attachment detected",
        "investigation_id": "INV-003",
        "severity": "medium",
        "timestamp": make_timestamp(90),
    },
    {
        "id": "ACT-004",
        "message": "New investigation started",
        "investigation_id": "INV-004",
        "severity": "low",
        "timestamp": make_timestamp(130),
    },
]


def get_investigation(investigation_id: str):
    for investigation in INVESTIGATIONS:
        if investigation["id"] == investigation_id:
            return investigation

    return None