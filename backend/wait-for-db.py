#!/usr/bin/env python3
import socket, time, sys, os

host = "db"
port = 5432

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

# execvp menggantikan proses ini → uvicorn jadi PID 1
os.execvp("uvicorn", [
    "uvicorn", "main:app",
    "--host", "0.0.0.0",
    "--port", "8000"
])
