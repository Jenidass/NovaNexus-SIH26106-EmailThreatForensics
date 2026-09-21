from fastapi import APIRouter, HTTPException
from app.data.mock_data import INVESTIGATIONS
from app.models.schemas import Evidence

router = APIRouter(
    prefix="/api/evidence",
    tags=["Evidence"],
)


@router.get("/{investigation_id}", response_model=list[Evidence])
def get_evidence(investigation_id: str):
    for investigation in INVESTIGATIONS:
        if investigation["id"] == investigation_id:
            evidence = []

            for index, indicator in enumerate(
                investigation["indicators"], start=1
            ):
                evidence.append(
                    {
                        "id": f"EVD-{investigation_id.split('-')[1]}-{index:03d}",
                        "investigation_id": investigation_id,
                        "type": indicator["type"],
                        "name": indicator["value"],
                        "hash": None,
                        "size": None,
                        "status": "flagged",
                    }
                )

            return evidence

    raise HTTPException(
        status_code=404,
        detail="Investigation not found",
    )