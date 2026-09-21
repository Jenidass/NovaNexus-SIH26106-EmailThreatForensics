from fastapi import APIRouter, HTTPException
from app.data.mock_data import INVESTIGATIONS
from app.models.schemas import ThreatIntelligence

router = APIRouter(
    prefix="/api/threat-intel",
    tags=["Threat Intelligence"],
)


@router.get(
    "/{indicator_type}/{value}",
    response_model=ThreatIntelligence,
)
def get_threat_intelligence(indicator_type: str, value: str):
    for investigation in INVESTIGATIONS:
        for indicator in investigation["indicators"]:
            if (
                indicator["type"].lower() == indicator_type.lower()
                and indicator["value"].lower() == value.lower()
            ):
                return {
                    "indicator_type": indicator["type"],
                    "value": indicator["value"],
                    "reputation": (
                        "malicious"
                        if indicator["risk"] == "critical"
                        else "suspicious"
                        if indicator["risk"] == "high"
                        else "unknown"
                    ),
                    "risk_score": (
                        95
                        if indicator["risk"] == "critical"
                        else 80
                        if indicator["risk"] == "high"
                        else 50
                    ),
                    "country": investigation["country"],
                    "city": investigation["city"],
                    "isp": investigation["isp"],
                    "asn": investigation["asn"],
                }

    raise HTTPException(
        status_code=404,
        detail="Indicator not found",
    )