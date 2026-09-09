from google import genai
from config import settings

print("Model:", repr(settings.MODEL_NAME))

client = genai.Client(api_key=settings.GEMINI_API_KEY)

response = client.models.generate_content(
    model=settings.MODEL_NAME,
    contents="what is my name"
)

print(response.text)