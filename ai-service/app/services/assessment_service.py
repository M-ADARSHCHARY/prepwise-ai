from app.prompts.assessment_prompt import build_assessment_prompt
from app.parsers.assessment_parser import parse_assessment_response
from app.services.gemini_client import generate_content


def generate_assessment(title, topics):
    prompt = build_assessment_prompt(title, topics)

    response = generate_content(prompt)

    return parse_assessment_response(response)