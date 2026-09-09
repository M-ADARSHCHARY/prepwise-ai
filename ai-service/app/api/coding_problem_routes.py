from fastapi import APIRouter

from app.models.coding_problem_schema import CodingProblemRequest
from app.services.coding_problem_service import generate_coding_problems


router = APIRouter(
    prefix="/api/coding-problems",
    tags=["Coding Problems"],
)


@router.post("/generate")
async def generate_coding_problems_route(
    request: CodingProblemRequest,
):
    result = generate_coding_problems(
        request.company,
        request.jobDescriptionText,
    )

    return result