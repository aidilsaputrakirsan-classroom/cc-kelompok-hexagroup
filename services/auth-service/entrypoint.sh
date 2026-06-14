#!/bin/bash
set -e

echo "🚀 Starting Auth Service..."

# Try to run database seeding (optional, don't fail if it errors)
echo "Running database seeding..."
python seed.py || echo "⚠️  Seed script failed, continuing anyway..."

echo "Starting uvicorn server..."
exec uvicorn main:app --host 0.0.0.0 --port 8001
