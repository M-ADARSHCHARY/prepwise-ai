# import json


# def parse_coding_problem_response(response):
#     try:
#         return json.loads(response)
#     except json.JSONDecodeError as error:
#         raise ValueError(
#             f"Invalid JSON returned by Gemini: {error}"
#         )

import json


def parse_coding_problem_response(response):
    try:
        data = json.loads(response)
    except json.JSONDecodeError as error:
        raise ValueError(
            f"Invalid JSON returned by Gemini: {error}"
        )

    recommendations = data.get("recommendations")

    if not isinstance(recommendations, list):
        raise ValueError(
            "Gemini response must contain a recommendations array"
        )

    if len(recommendations) != 25:
        raise ValueError(
            f"Expected exactly 25 recommendations, got {len(recommendations)}"
        )

    valid_platforms = {"LeetCode", "GeeksForGeeks"}
    valid_difficulties = {"Easy", "Medium", "Hard"}

    for index, problem in enumerate(recommendations):

        if not isinstance(problem, dict):
            raise ValueError(
                f"Recommendation {index + 1} must be an object"
            )

        required_fields = [
            "title",
            "platform",
            "problemNumber",
            "pattern",
            "difficulty",
        ]

        for field in required_fields:
            if field not in problem:
                raise ValueError(
                    f"Recommendation {index + 1} missing field: {field}"
                )

        if problem["platform"] not in valid_platforms:
            raise ValueError(
                f"Invalid platform: {problem['platform']}"
            )

        if problem["difficulty"] not in valid_difficulties:
            raise ValueError(
                f"Invalid difficulty: {problem['difficulty']}"
            )

        if (
            problem["problemNumber"] is not None
            and not isinstance(problem["problemNumber"], int)
        ):
            raise ValueError(
                f"Invalid problem number for recommendation {index + 1}"
            )

    return data