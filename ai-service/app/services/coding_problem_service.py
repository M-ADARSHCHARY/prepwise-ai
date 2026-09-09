from app.prompts.coding_problem_prompt import build_coding_problem_prompt
from app.parsers.coding_problem_parser import parse_coding_problem_response
from app.services.gemini_client import generate_content


def generate_coding_problems(company, job_description_text):
    prompt = build_coding_problem_prompt(
        company,
        job_description_text,
    )

    response = generate_content(prompt)

    return parse_coding_problem_response(response)