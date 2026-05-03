import os
import firebase_admin
from firebase_admin import credentials, auth
from core.config import settings

def init_firebase():
    if not firebase_admin._apps:
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            key_path = os.path.join(base_dir, settings.FIREBASE_KEY_PATH)
            if os.path.exists(key_path):
                cred = credentials.Certificate(key_path)
                firebase_admin.initialize_app(cred)
                print("Firebase initialized successfully.")
            else:
                print(f"Warning: Firebase key not found at {key_path}. Auth will fail.")
        except Exception as e:
            print(f"Warning: Firebase initialization failed. Error: {e}")

init_firebase()
