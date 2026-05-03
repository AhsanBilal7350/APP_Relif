from groq import Groq
from core.config import settings

def get_groq_client():
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your_groq_api_key_here":
        return None
    try:
        return Groq(api_key=settings.GROQ_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Groq client: {e}")
        return None
