import json


def parse_roadmap_response(response_text: str):
    try:
        cleaned = (
            response_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        roadmap = json.loads(cleaned)

        return roadmap

    except Exception as e:
        raise ValueError(f"Failed to parse roadmap response: {str(e)}")