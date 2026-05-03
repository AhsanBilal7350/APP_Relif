"""Vercel serverless entry point for the Relief API."""
import sys
import os

# Add the backend root to Python path so all package imports resolve correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app  # noqa: E402

# Vercel's @vercel/python runtime auto-detects this FastAPI/ASGI app
