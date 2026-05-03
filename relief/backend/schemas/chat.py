from pydantic import BaseModel, Field
from typing import List

class ChatMessage(BaseModel):
    role: str
    content: str = Field(..., min_length=1, max_length=5000)

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    history: List[ChatMessage] = Field(default_factory=list)

class ChatResponse(BaseModel):
    response: str
