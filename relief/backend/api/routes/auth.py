from fastapi import APIRouter, HTTPException
from schemas.user import UserRequest
from services.auth_service import AuthService

router = APIRouter()

@router.post("/signup")
async def signup(user: UserRequest):
    try:
        return AuthService.create_user(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login")
async def login(user: UserRequest):
    try:
        return AuthService.login_user(user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
