import json


def build_coding_problem_prompt(
    company: str,
    job_description_text: str,
) -> str:

    schema = {
        "recommendations": [
            {
                "title": "string",
                "platform": "LeetCode",
                "problemNumber": 1,
                "pattern": "string",
                "difficulty": "Easy",
            }
        ]
    }

    return f"""
You are an expert Software Engineering Interview Preparation Assistant.

Analyze the target company and job description below.

Company:
{company}

Job Description:
{job_description_text}

Generate exactly 25 coding problem recommendations that are highly relevant
to the company's software engineering role and the skills mentioned in the
job description.


Requirements:

1. Generate exactly 25 problems.

2. Aim for approximately:
   - 5 Easy problems
   - 15 Medium problems
   - 5 Hard problems.

3. Prefer LeetCode problems whenever a suitable problem exists.

4. Use GeeksForGeeks only when an appropriate LeetCode problem is not available.

5. Recommend only real, existing problems.

6. Do NOT invent problem names.

7. Do NOT invent LeetCode problem numbers.

8. If the problem is from LeetCode, provide its actual problem number.

9. If the problem does not have an applicable problem number, use null.

10. Every problem must have a specific DSA pattern.

11. Difficulty must be Easy, Medium, or Hard.

12. Do not include URLs.

13. Do not include duplicate problems.

14. Recommendations should be relevant to the company and job description.

15. Do not base recommendations on any roadmap or assessment.

16. Return ONLY valid JSON.

17. Do NOT return markdown.

18. Do NOT wrap the response inside ```.
19. Do NOT include any additional text or explanations.

JSON Schema:

{json.dumps(schema, indent=2)}
"""