#!/bin/bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# run seed db (on backend folder)
PYTHONPATH=. python scripts/seed_db.py

# run seed db untuk windows
$env:PYTHONPATH="."; python scripts\seed_db.py