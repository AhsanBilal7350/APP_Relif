from core.groq_client import get_groq_client

class ChatService:
    @staticmethod
    def get_ai_insight(message: str, history: list = None) -> str:
        client = get_groq_client()
        if not client:
            return "AI service is currently unavailable. Please check the API configuration."
        
        try:
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a highly empathetic and supportive AI wellness companion. "
                        "You provide mental health insights based on what users share with you. "
                        "Keep responses short (2-4 sentences), encouraging, warm, and kind. "
                        "Ask gentle follow-up questions to keep the conversation going. "
                        "Never diagnose or prescribe — always suggest professional help for serious concerns."
                    )
                }
            ]

            # Add conversation history for context
            if history:
                for msg in history:
                    messages.append({"role": msg.role, "content": msg.content})

            # Add the current user message
            messages.append({"role": "user", "content": message})

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            return "AI service encountered an error while processing your request."
