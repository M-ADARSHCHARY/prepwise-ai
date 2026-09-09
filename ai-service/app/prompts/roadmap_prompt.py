import json


def build_roadmap_prompt(data):
    weak_areas_text = json.dumps(
        getattr(data, "weakAreas", None) or [],
        indent=2,
    )

    generation_mode = getattr(data, "mode", "standard")

    previous_roadmap = getattr(data, "previousRoadmap", None) or []
    start_item = getattr(data, "startItem", None)

    previous_roadmap_text = json.dumps(
        previous_roadmap,
        indent=2,
    )

    start_item_text = json.dumps(
        start_item,
        indent=2,
    )

    if generation_mode == "adaptive":
        mode_instructions = f"""
ADAPTIVE ROADMAP MODE

The candidate has performed poorly in an assessment.

The complete existing roadmap is provided below:

Existing Roadmap:
{previous_roadmap_text}

The exact roadmap item where adaptation must begin is:

Start Item:
{start_item_text}

IMPORTANT ADAPTIVE RULES:

1. Everything BEFORE the Start Item has already been completed or must
   remain unchanged.

2. Do NOT regenerate, modify, or replace anything before the Start Item.

3. Generate a replacement roadmap starting FROM the Start Item.

4. The generated items will replace the Start Item and every item AFTER
   the Start Item in the existing roadmap.

5. Return ONLY the newly generated replacement items in the "items" array.
   Do NOT return the preserved previous items.

6. Use the complete existing roadmap as context to understand what the
   candidate has already studied and what was originally planned.

7. Do NOT unnecessarily repeat topics, tasks, projects, or concepts that
   have already been covered in the existing roadmap.

8. Repetition is allowed when it is necessary to strengthen a weak area.

9. Give higher priority to the candidate's weak areas from the assessment.

10. Do NOT simply create remedial tasks and forget the remaining preparation
    plan.

11. Preserve important future topics and tasks from the existing roadmap
    whenever they are still relevant.

12. Reorganize the remaining roadmap when necessary so that weak areas are
    reinforced while important future topics are still covered.

13. The generated roadmap must remain useful for the candidate's remaining
    preparation period.

14. Continue naturally from the preserved portion of the roadmap.

15. The first generated item should address the Start Item or provide an
    appropriate revised learning activity for that failed item.

16. Continue covering relevant company, role, job description, missing-skill,
    coding, CS fundamentals, resume, and project preparation as appropriate.

17. Do NOT change previously completed roadmap items.

18. The backend will preserve all existing items before the Start Item and
    will replace the roadmap from the Start Item onward.

"""

    else:
        mode_instructions = f"""
STANDARD ROADMAP MODE

Generate a completely new roadmap for exactly
{data.timeAvailableDays} days.

There is no previous roadmap to preserve.

Generate the complete preparation plan from Day 1 through
Day {data.timeAvailableDays}.
"""

    return f"""
You are an expert interview preparation mentor.

Your job is to generate a personalized interview preparation roadmap.

Generation Mode:

{generation_mode}

Candidate Information

Target Company:

{data.company}

Role:

{data.role}

Time Available:

{data.timeAvailableDays} days

Resume

{data.resumeText}

Job Description

{data.jobDescriptionText}

ATS Score:

{data.atsScore}

Matched Skills

{json.dumps(data.matchedSkills, indent=2)}

Missing Skills

{json.dumps(data.missingSkills, indent=2)}

Resume Improvements

{json.dumps(data.resumeImprovements, indent=2)}

AI Resume Summary

{data.aiSummary}

Weak Areas From Assessment

{weak_areas_text}

{mode_instructions}

GENERAL ROADMAP INSTRUCTIONS

1. Every day should have 3-5 tasks when generating a complete roadmap.

2. Include appropriate tasks from:

- Resume Revision
- Project Revision
- Coding Practice
- CS Fundamentals
- Missing Skills

3. Coding Practice should focus on topics relevant to the job description
   and, when possible, company-focused preparation.

4. Resume Revision should only revise technologies mentioned in the
   candidate's resume.

5. Project Revision should only revise projects present in the resume.

6. Missing Skills should come from the missingSkills list.

7. CS Fundamentals should include only relevant subjects such as
   Operating Systems, DBMS, Computer Networks, and OOP when appropriate.

8. Balance the workload appropriately across the available preparation
   period.

9. Do not invent technologies, projects, skills, or experience that are
   not supported by the candidate information.

10. Keep tasks practical and suitable for interview preparation.

11. Focus on high-value topics relevant to the target company, role,
    and job description.

12. For adaptive mode, weak areas should receive additional attention,
    but the remaining important preparation topics should not be forgotten.

13. For adaptive mode, avoid unnecessary repetition of completed material.

14. Return ONLY valid JSON.

The JSON must exactly follow this structure:

{{
  "totalDays": number,
  "focusAreas": [
    "string"
  ],
  "items": [
    {{
      "dayNumber": number,
      "title": "string",
      "category": "resume_revision | project_revision | coding_practice | cs_fundamentals | missing_skill",
      "durationHours": number,
      "description": "string",
      "topics": [
        "string"
      ]
    }}
  ]
}}

ADAPTIVE OUTPUT RULES

If the generation mode is adaptive:

- "items" must contain ONLY newly generated replacement items.
- Do NOT include preserved previous items.
- Do NOT generate items before the Start Item.
- Start from the Start Item and cover the remaining preparation period.
- Preserve the important future topics from the previous roadmap.
- Reinforce weak areas where appropriate.
- Avoid unnecessary repetition.
- The backend will preserve all previous items before the Start Item.
- The backend will replace all items from the Start Item onward.

If the generation mode is standard:

- Generate the complete roadmap.
- Generate tasks from Day 1 through the final available day.

Do not include explanations.

Do not include markdown.

Do not wrap JSON inside triple backticks.

Return ONLY the JSON object.
"""