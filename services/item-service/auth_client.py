"""HTTP client untuk berkomunikasi dengan Auth Service."""
import os
import httpx
from fastapi import HTTPException, Header

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")

async def verify_token_with_auth_service(authorization: str = Header(...)) -> dict:
    """Kirim token ke Auth Service untuk diverifikasi."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{AUTH_SERVICE_URL}/verify",
                headers={"Authorization": authorization},
                timeout=5.0,
            )
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 401:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        else:
            raise HTTPException(status_code=503, detail="Auth service unavailable")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Cannot connect to Auth Service")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Auth Service timeout")