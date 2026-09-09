import json


def parse_assessment_response(response_text: str):
    try:
        cleaned = (
            response_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        assessment = json.loads(cleaned)

        return assessment

    except Exception as e:
        raise ValueError(f"Failed to parse assessment response: {str(e)}")