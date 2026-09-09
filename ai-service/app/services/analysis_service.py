from app.prompts.prompt_builder import build_analysis_prompt
from app.services.gemini_client import generate_content
from app.parsers.response_parsers import parse_analysis_response


async def analyze_session(resume_text: str, job_description_text: str):

    prompt = build_analysis_prompt(
        resume_text,
        job_description_text
    )

    raw_response = generate_content(prompt)

    return parse_analysis_response(raw_response)