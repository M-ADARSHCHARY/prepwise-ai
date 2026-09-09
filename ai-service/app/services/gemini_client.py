from google import genai
from app.config import settings



client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_content(prompt: str):
    response = client.models.generate_content(
        model=settings.MODEL_NAME,
        contents=prompt
    )

    return response.text