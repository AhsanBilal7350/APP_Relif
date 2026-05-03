import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import and initialize Firebase early
import core.firebase

# Import routes
from api.routes import auth, chat, emergency

app = FastAPI(title="Relief API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Include Routers
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(emergency.router, prefix="/api/emergency", tags=["Emergency"])

# Mount Frontend Static Files (only when running locally, not in serverless)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

if os.path.isdir(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

# Serverless handler (Vercel / AWS Lambda)
try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:
    handler = None
