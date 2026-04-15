#!/usr/bin/env python3
import socket, time, sys
import subprocess

host = "db"
port = 5432

# tunggu database
for i in range(30):
    try:
        with socket.create_connection((host, port), timeout=2):
            print("Database ready!")
            break
    except OSError:
        print("Waiting for database...")
        time.sleep(1)
else:
    print("Database not ready after 30s")
    sys.exit(1)

# jalankan uvicorn sebagai process utama container
subprocess.run([
    "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"
])
