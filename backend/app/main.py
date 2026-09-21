from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    dashboard,
    emails,
    threat_intel,
    geolocation,
    reports,
    evidence,
)
app = FastAPI(
    title="Nova Nexus API",
    description="AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(emails.router)
app.include_router(threat_intel.router)
app.include_router(geolocation.router)
app.include_router(reports.router)
app.include_router(evidence.router)

@app.get("/")
def root():
    return {
        "message": "Nova Nexus API is running",
        "status": "online",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Nova Nexus Backend",
    }