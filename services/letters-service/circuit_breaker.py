"""Circuit Breaker — mencegah cascading failure ke auth-service."""
import time
import logging

logger = logging.getLogger(__name__)


class CircuitBreaker:
    """
    States:
    - CLOSED:    Normal, request diteruskan.
    - OPEN:      Tripped, request langsung ditolak (fail fast).
    - HALF_OPEN: Testing, 1 request diizinkan untuk cek recovery.
    """

    def __init__(self, name: str, failure_threshold: int = 5, cooldown_seconds: int = 30):
        self.name = name
        self.failure_threshold = failure_threshold
        self.cooldown_seconds = cooldown_seconds
        self.failure_count = 0
        self.state = "CLOSED"
        self.last_failure_time = None
        self.total_rejected = 0

    def can_execute(self) -> bool:
        if self.state == "CLOSED":
            return True

        if self.state == "OPEN":
            elapsed = time.time() - self.last_failure_time
            if elapsed >= self.cooldown_seconds:
                logger.info(f"[CircuitBreaker:{self.name}] OPEN → HALF_OPEN")
                self.state = "HALF_OPEN"
                return True
            self.total_rejected += 1
            logger.debug(f"[CircuitBreaker:{self.name}] Request ditolak, cooldown remaining: {int(self.cooldown_seconds - elapsed)}s")
            return False

        return True  # HALF_OPEN

    def record_success(self):
        if self.state == "HALF_OPEN":
            logger.info(f"[CircuitBreaker:{self.name}] HALF_OPEN → CLOSED")
        self.failure_count = 0
        self.state = "CLOSED"

    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.state == "HALF_OPEN":
            logger.warning(f"[CircuitBreaker:{self.name}] HALF_OPEN → OPEN")
            self.state = "OPEN"
        elif self.failure_count >= self.failure_threshold:
            logger.error(f"[CircuitBreaker:{self.name}] Threshold {self.failure_count}/{self.failure_threshold} → OPEN")
            self.state = "OPEN"

    def get_status(self) -> dict:
        return {
            "name": self.name,
            "state": self.state,
            "failure_count": self.failure_count,
            "failure_threshold": self.failure_threshold,
            "cooldown_seconds": self.cooldown_seconds,
            "total_rejected": self.total_rejected,
        }
