import json


def build_analysis_prompt(resume_text: str, job_description_text: str) -> str:
    schema = {
        "atsScore": 0,
        "matchedSkills": ["string"],
        "missingSkills": [
            {
                "skill": "string",
                "priority": "high | medium | low"
            }
        ],
        "resumeImprovements": [
            {
                "section": "string",
                "suggestion": "string"
            }
        ],
        "aiSummary": "string"
    }

    return f"""
You are an expert ATS Resume Analyzer.

Compare the resume against the job description.

Evaluate:

1. ATS Score (0-100)
2. Skills present in both resume and job description.
3. Missing skills required by the job.
4. Resume improvements.
5. Overall summary.

Return ONLY valid JSON.

JSON Schema:

{json.dumps(schema, indent=2)}

Resume:

{resume_text}

Job Description:

{job_description_text}
"""