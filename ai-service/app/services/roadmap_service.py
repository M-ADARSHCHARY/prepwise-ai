import json

from app.prompts.roadmap_prompt import build_roadmap_prompt
from app.parsers.roadmap_parser import parse_roadmap_response
from app.services.gemini_client import generate_content


def generate_roadmap(request):
    prompt = build_roadmap_prompt(request)

    response = generate_content(prompt)
    print("roadmap generated")
    return parse_roadmap_response(response)