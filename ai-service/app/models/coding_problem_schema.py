from pydantic import BaseModel


class CodingProblemRequest(BaseModel):
    company: str
    jobDescriptionText: str