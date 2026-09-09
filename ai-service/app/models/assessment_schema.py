from pydantic import BaseModel


class AssessmentRequest(BaseModel):
    title: str
    topics: list[str]