from fastapi import APIRouter
from services.emergency_service import EmergencyService

router = APIRouter()

@router.get("")
async def get_emergency():
    return EmergencyService.get_helplines()
