import json


def parse_analysis_response(response: str):
    response = response.strip()

    if response.startswith("```json"):
        response = response.replace("```json", "")
        response = response.replace("```", "")

    return json.loads(response)