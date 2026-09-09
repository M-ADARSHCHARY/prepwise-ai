from fastapi import APIRouter, HTTPException

from app.models.roadmap_schema import RoadmapRequest
from app.services.roadmap_service import generate_roadmap

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])


@router.post("/generate")
def generate_roadmap_endpoint(request: RoadmapRequest):
    try:
        roadmap = generate_roadmap(request)

        return roadmap

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )