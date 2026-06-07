"""HTTP client to verify tokens against Auth Service.
Dilengkapi retry + exponential backoff + circuit breaker.
"""
import time
import logging
import httpx
import os
from fastapi import HTTPException, status
from circuit_breaker import CircuitBreaker

logger = logging.getLogger(__name__)

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")

# Retry config
MAX_RETRIES = 3
BASE_DELAY = 0.5  # detik — akan jadi 0.5s, 1s, 2s
TIMEOUT_SECONDS = 5.0
RETRYABLE_STATUS_CODES = {500, 502, 503, 504}

# Circuit breaker instance (global, shared seluruh app)
auth_circuit = CircuitBreaker(
    name="auth-service",
    failure_threshold=5,
    cooldown_seconds=30,
)


def verify_token(token: str) -> dict:
    """
    Verifikasi token ke auth-service /auth/internal/verify-token.
    Dengan retry + exponential backoff + circuit breaker.
    Returns dict: {valid, email, role, user_id}
    """
    # Circuit breaker check — fail fast kalau OPEN
    if not auth_circuit.can_execute():
        raise HTTPException(
            status_code=503,
            detail="Auth service circuit breaker OPEN. Try again later."
        )

    last_exception = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = httpx.post(
                f"{AUTH_SERVICE_URL}/auth/internal/verify-token",
                json={"token": token},
                timeout=TIMEOUT_SECONDS,
            )

            # Success
            if resp.status_code == 200:
                auth_circuit.record_success()
                data = resp.json()
                if not data.get("valid"):
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
                return data

            # Non-retryable
            if resp.status_code == 401:
                auth_circuit.record_success()  # Auth service responsif, token aja yang salah
                raise HTTPException(status_code=401, detail="Invalid or expired token")

            # Retryable server errors
            if resp.status_code in RETRYABLE_STATUS_CODES:
                logger.warning(f"Auth service returned {resp.status_code} (attempt {attempt}/{MAX_RETRIES})")
                _ = HTTPException(status_code=resp.status_code, detail=f"Auth service error: {resp.status_code}")

            else:
                raise HTTPException(status_code=resp.status_code, detail=f"Unexpected auth response: {resp.status_code}")

        except httpx.ConnectError as e:
            logger.warning(f"Cannot connect to auth-service (attempt {attempt}/{MAX_RETRIES}): {e}")
            _ = e

        except httpx.TimeoutException as e:
            logger.warning(f"Auth service timeout (attempt {attempt}/{MAX_RETRIES}): {e}")
            _ = e

        # Exponential backoff sebelum retry berikutnya
        if attempt < MAX_RETRIES:
            delay = BASE_DELAY * (2 ** (attempt - 1))  # 0.5s, 1s, 2s
            logger.info(f"Retrying in {delay}s...")
            time.sleep(delay)

    # Semua retry gagal
    auth_circuit.record_failure()
    logger.error(f"Auth service unreachable after {MAX_RETRIES} attempts")
    raise HTTPException(status_code=503, detail="Auth service unavailable. Please try again later.")
