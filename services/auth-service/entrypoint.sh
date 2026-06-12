#!/bin/bash
set -e

echo "Running database seeding..."
python seed.py

echo "Starting uvicorn server..."
exec uvicorn main:app --host 0.0.0.0 --port 8001
