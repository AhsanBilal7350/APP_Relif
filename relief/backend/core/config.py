import os
from dotenv import load_dotenv

# Explicitly resolve .env path relative to the backend root
_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_env_path = os.path.join(_backend_dir, ".env")
load_dotenv(_env_path, override=True)

class Settings:
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
    FIREBASE_KEY_PATH = os.environ.get("FIREBASE_KEY_PATH", "firebase-key.json")

settings = Settings()
