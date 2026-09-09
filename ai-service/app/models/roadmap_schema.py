from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class RoadmapRequest(BaseModel):
    company: str
    role: str
    timeAvailableDays: int

    resumeText: str
    jobDescriptionText: str

    atsScore: int

    matchedSkills: List[str]
    missingSkills: List[str]
    resumeImprovements: List[str]

    aiSummary: str

    mode: str = "standard"

    weakAreas: Optional[List[dict]] = None

    # Used for adaptive roadmap generation
    previousRoadmap: Optional[List[Dict[str, Any]]] = None

    # Exact item where the adaptive roadmap should begin
    startItem: Optional[Dict[str, Any]] = None