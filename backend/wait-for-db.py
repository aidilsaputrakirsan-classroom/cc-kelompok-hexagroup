#!/usr/bin/env python3
import time
import sys
import os
from urllib.parse import urlparse
import socket

database_url = os.getenv("DATABASE_URL")

if not database_url:
    print("DATABASE_URL not set")
    sys.exit(1)

parsed = urlparse(database_url)

host = parsed.hostname
port = parsed.port or 5432

for i in range(30):
    try:
        with socket.create_connection((host, port), timeout=2):
            print("Database ready!")
            break
    except OSError:
        print(f"Waiting for database... ({i+1}/30)")
        time.sleep(1)
else:
    print("Database not ready after 30s, exiting.")
    sys.exit(1)

os.execvp("uvicorn", [
    "uvicorn", "main:app",
    "--host", "0.0.0.0",
    "--port", os.getenv("PORT", "8000")
])
