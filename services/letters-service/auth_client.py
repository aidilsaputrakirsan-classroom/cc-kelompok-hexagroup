"""HTTP client to verify tokens against Auth Service."""
import httpx
import os
from fastapi import HTTPException, status

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")


def verify_token(token: str) -> dict:
    """
    Call auth-service /internal/verify-token.
    Returns dict: {valid, email, role, user_id}
    Raises 401 if invalid, 503 if auth-service unreachable.
    """
    try:
        resp = httpx.post(
            f"{AUTH_SERVICE_URL}/auth/internal/verify-token",
            json={"token": token},
            timeout=5.0
        )
        resp.raise_for_status()
        data = resp.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Auth service unavailable")

    if not data.get("valid"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    return data
