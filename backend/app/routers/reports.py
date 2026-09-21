from fastapi import APIRouter, HTTPException
from app.data.mock_data import INVESTIGATIONS
from app.models.schemas import ReportSummary

router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"],
)


def build_report(investigation: dict) -> dict:
    return {
        "id": f"RPT-{investigation['id'].split('-')[1]}",
        "investigation_id": investigation["id"],
        "title": f"Threat Investigation Report - {investigation['subject']}",
        "severity": investigation["severity"],
        "threat_score": investigation["threat_score"],
        "status": "completed",
        "created_at": investigation["timestamp"],
    }


@router.get("", response_model=list[ReportSummary])
def get_reports():
    return [build_report(item) for item in INVESTIGATIONS]


@router.get("/{report_id}", response_model=ReportSummary)
def get_report(report_id: str):
    for investigation in INVESTIGATIONS:
        report = build_report(investigation)

        if report["id"] == report_id:
            return report

    raise HTTPException(
        status_code=404,
        detail="Report not found",
    )


@router.post(
    "/generate/{investigation_id}",
    response_model=ReportSummary,
)
def generate_report(investigation_id: str):
    for investigation in INVESTIGATIONS:
        if investigation["id"] == investigation_id:
            return build_report(investigation)

    raise HTTPException(
        status_code=404,
        detail="Investigation not found",
    )