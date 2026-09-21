from fastapi import APIRouter, HTTPException
from app.data.mock_data import INVESTIGATIONS
from app.models.schemas import GeoLocation

router = APIRouter(
    prefix="/api/geolocation",
    tags=["GeoLocation"],
)


@router.get(
    "/{ip}",
    response_model=GeoLocation,
)
def get_geolocation(ip: str):
    for investigation in INVESTIGATIONS:
        if investigation["ip"] == ip:
            return {
                "investigation_id": investigation["id"],
                "ip": investigation["ip"],
                "country": investigation["country"],
                "city": investigation["city"],
                "region": investigation["country"],
                "isp": investigation["isp"],
                "asn": investigation["asn"],
                "latitude": None,
                "longitude": None,
            }

    raise HTTPException(
        status_code=404,
        detail="IP address not found",
    )


@router.get(
    "/investigation/{investigation_id}",
    response_model=GeoLocation,
)
def get_investigation_location(investigation_id: str):
    for investigation in INVESTIGATIONS:
        if investigation["id"] == investigation_id:
            return {
                "investigation_id": investigation["id"],
                "ip": investigation["ip"],
                "country": investigation["country"],
                "city": investigation["city"],
                "region": investigation["country"],
                "isp": investigation["isp"],
                "asn": investigation["asn"],
                "latitude": None,
                "longitude": None,
            }

    raise HTTPException(
        status_code=404,
        detail="Investigation not found",
    )