from fastapi import APIRouter, HTTPException

from app.models.assessment_schema import AssessmentRequest
from app.services.assessment_service import generate_assessment

router = APIRouter(
    prefix="/api/assessment",
    tags=["Assessment"]
)


@router.post("/generate")
def generate_assessment_endpoint(request: AssessmentRequest):
    try:
        assessment = generate_assessment(
            request.title,
            request.topics
        )

        return assessment

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )