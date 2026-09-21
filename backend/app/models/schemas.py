from pydantic import BaseModel
from typing import List, Optional


class Indicator(BaseModel):
    type: str
    value: str
    risk: str


class Investigation(BaseModel):
    id: str
    subject: str
    sender: str
    recipient: str
    status: str
    severity: str
    threat_score: int
    category: str
    timestamp: str
    ip: str
    domain: str
    country: str
    city: str
    isp: str
    asn: str
    indicators: List[Indicator]
    findings: List[str]


class Activity(BaseModel):
    id: str
    message: str
    investigation_id: str
    severity: str
    timestamp: str


class DashboardStats(BaseModel):
    total_investigations: int
    threats_detected: int
    high_risk_emails: int
    critical_threats: int
    suspicious_indicators: int


class DashboardResponse(BaseModel):
    stats: DashboardStats
    severity_distribution: dict
    category_distribution: dict
    recent_investigations: List[Investigation]
    activity: List[Activity]


class ThreatAnalysis(BaseModel):
    investigation_id: str
    threat_score: int
    classification: str
    severity: str
    category: str
    findings: List[str]
    indicators: List[Indicator]


class ThreatIntelligence(BaseModel):
    indicator_type: str
    value: str
    reputation: str
    risk_score: int
    country: Optional[str] = None
    city: Optional[str] = None
    isp: Optional[str] = None
    asn: Optional[str] = None


class GeoLocation(BaseModel):
    investigation_id: str
    ip: str
    country: str
    city: str
    region: Optional[str] = None
    isp: str
    asn: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ReportSummary(BaseModel):
    id: str
    investigation_id: str
    title: str
    severity: str
    threat_score: int
    status: str
    created_at: str


class Evidence(BaseModel):
    id: str
    investigation_id: str
    type: str
    name: str
    hash: Optional[str] = None
    size: Optional[str] = None
    status: str