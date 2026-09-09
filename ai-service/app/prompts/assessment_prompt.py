import json


def build_assessment_prompt(title: str, topics: list[str]) -> str:
    schema = {
        "questions": [
            {
                "question": "string",
                "topic": "string",
                "options": [
                    "string",
                    "string",
                    "string",
                    "string"
                ],
                "correctAnswer": "string",
                "explanation": "string"
            }
        ]
    }

    return f"""
You are an expert Software Engineering Interviewer.

Generate exactly 10 high-quality multiple choice questions.

Roadmap Topic:

{title}

Topics to Cover:

{", ".join(topics)}

Requirements:

1. Generate exactly 10 questions.
2. Every question must have exactly 4 options.
3. Only one option should be correct.
4. Questions should test conceptual understanding.
5. Difficulty should be suitable for Software Engineering Internship interviews.
6. Cover all provided topics.
7. For every question, provide a specific topic representing the technical concept being tested.
8. The topic must be specific enough to identify the candidate's strengths and weaknesses.
9. Use concise technical topics such as:
- Sliding Window
- Two Pointers
- Prefix Sum
- Hash Map
- Binary Search
- Dynamic Programming
- SQL Joins
- DBMS Indexing
- Operating Systems
- Computer Networks
10. Do not use broad topics such as:
- Coding
- DSA
- Programming
- Computer Science
11. Return ONLY valid JSON.
12. Do NOT return markdown.
13. Do NOT wrap the response inside ```.

JSON Schema:

{json.dumps(schema, indent=2)}
"""