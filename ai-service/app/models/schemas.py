from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    resume_text: str
    job_description_text: str


class MissingSkill(BaseModel):
    skill: str
    priority: str


class ResumeImprovement(BaseModel):
    section: str
    suggestion: str


class AnalysisResponse(BaseModel):
    atsScore: int
    matchedSkills: list[str]
    missingSkills: list[MissingSkill]
    resumeImprovements: list[ResumeImprovement]
    aiSummary: str