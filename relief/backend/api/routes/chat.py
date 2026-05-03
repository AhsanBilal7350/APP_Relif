from fastapi import APIRouter
from schemas.chat import ChatRequest
from services.chat_service import ChatService

router = APIRouter()

@router.post("")
async def chat(req: ChatRequest):
    response_text = ChatService.get_ai_insight(req.message, req.history)
    return {"response": response_text}
