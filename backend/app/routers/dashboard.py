from fastapi import APIRouter
from app.data.mock_data import INVESTIGATIONS, ACTIVITY_LOG
from app.models.schemas import DashboardResponse

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/overview", response_model=DashboardResponse)
def get_dashboard_overview():
    total_investigations = len(INVESTIGATIONS)

    threats_detected = sum(
        1 for item in INVESTIGATIONS
        if item["threat_score"] >= 50
    )

    high_risk_emails = sum(
        1 for item in INVESTIGATIONS
        if item["severity"] in ["high", "critical"]
    )

    critical_threats = sum(
        1 for item in INVESTIGATIONS
        if item["severity"] == "critical"
    )

    suspicious_indicators = sum(
        len(item["indicators"])
        for item in INVESTIGATIONS
    )

    severity_distribution = {
        "critical": sum(
            1 for item in INVESTIGATIONS
            if item["severity"] == "critical"
        ),
        "high": sum(
            1 for item in INVESTIGATIONS
            if item["severity"] == "high"
        ),
        "medium": sum(
            1 for item in INVESTIGATIONS
            if item["severity"] == "medium"
        ),
        "low": sum(
            1 for item in INVESTIGATIONS
            if item["severity"] == "low"
        ),
    }

    category_distribution = {}

    for item in INVESTIGATIONS:
        category = item["category"]
        category_distribution[category] = (
            category_distribution.get(category, 0) + 1
        )

    return {
        "stats": {
            "total_investigations": total_investigations,
            "threats_detected": threats_detected,
            "high_risk_emails": high_risk_emails,
            "critical_threats": critical_threats,
            "suspicious_indicators": suspicious_indicators,
        },
        "severity_distribution": severity_distribution,
        "category_distribution": category_distribution,
        "recent_investigations": INVESTIGATIONS[:5],
        "activity": ACTIVITY_LOG[:10],
    }