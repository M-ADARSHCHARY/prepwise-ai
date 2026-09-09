from fastapi import APIRouter
from app.models.schemas import AnalysisRequest
from app.services.analysis_service import analyze_session


router = APIRouter(prefix="/api", tags=["Analysis"])

@router.post("/analyze")
async def analyze_resume(request: AnalysisRequest):

    result = await analyze_session(
        request.resume_text,
        request.job_description_text
    )

    return result