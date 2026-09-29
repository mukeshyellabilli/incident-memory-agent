from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from backend.agent import analyze_incident
from backend.memory import remember_resolution


BASE_DIR = Path(__file__).resolve().parent.parent

FRONTEND_DIR = BASE_DIR / "frontend"
CSS_DIR = FRONTEND_DIR / "css"
JS_DIR = FRONTEND_DIR / "js"


app = FastAPI(
    title="AI Incident Memory Agent",
    description="AI-powered incident analysis using Hindsight memory",
    version="1.0.0"
)


# ========================================
# STATIC FILES
# ========================================

app.mount(
    "/css",
    StaticFiles(directory=str(CSS_DIR)),
    name="css"
)

app.mount(
    "/js",
    StaticFiles(directory=str(JS_DIR)),
    name="js"
)


# ========================================
# REQUEST MODELS
# ========================================

class IncidentRequest(BaseModel):

    incident_description: str


class ResolutionRequest(BaseModel):

    incident_description: str
    resolution: str


# ========================================
# HOME PAGE
# ========================================

@app.get("/")
def home():

    return FileResponse(
        FRONTEND_DIR / "index.html"
    )


# ========================================
# ANALYZE INCIDENT
# ========================================

@app.post("/analyze-incident")
def analyze(request: IncidentRequest):

    result = analyze_incident(
        request.incident_description
    )

    return result


# ========================================
# REMEMBER RESOLUTION
# ========================================

@app.post("/remember-resolution")
def remember_incident_resolution(
    request: ResolutionRequest
):

    result = remember_resolution(
        request.incident_description,
        request.resolution
    )

    return {
        "message": result
    }