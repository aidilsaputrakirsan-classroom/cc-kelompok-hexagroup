"""
Data Migration Script
Migrasi data dari monolith ke microservices.
Usage: python scripts/migrate_data.py
"""
import os
import sys
from sqlalchemy import create_engine, text

MONOLITH_DB_URL = os.getenv(
    "MONOLITH_DB_URL",
    "postgresql://postgres:postgres@localhost:5432/cloudapp"
)
AUTH_DB_URL = os.getenv(
    "AUTH_DB_URL",
    "postgresql://postgres:postgres@localhost:5433/auth_db"
)
FINANCE_DB_URL = os.getenv(
    "FINANCE_DB_URL",
    "postgresql://postgres:postgres@localhost:5434/finance_db"
)
LETTER_DB_URL = os.getenv(
    "LETTER_DB_URL",
    "postgresql://postgres:postgres@localhost:5435/letter_db"
)


def migrate():
    print("=" * 50)
    print("DATA MIGRATION: Monolith → Microservices")
    print("=" * 50)

    monolith = create_engine(MONOLITH_DB_URL)
    auth_db = create_engine(AUTH_DB_URL)

    # Step 1: Migrate users ke auth_db
    print("\n[1/2] Migrating users → auth_db...")
    with monolith.connect() as src:
        users = src.execute(text("SELECT * FROM users")).fetchall()
        print(f"  Found {len(users)} users in monolith")

    with auth_db.connect() as dst:
        for user in users:
            dst.execute(
                text("""
                    INSERT INTO users (id, email, name, hashed_password, created_at)
                    VALUES (:id, :email, :name, :hashed_password, :created_at)
                    ON CONFLICT (id) DO NOTHING
                """),
                {"id": user.id, "email": user.email, "name": user.name,
                 "hashed_password": user.hashed_password, "created_at": user.created_at}
            )
        dst.commit()
    print(f"  ✅ Migrated {len(users)} users")

    print("\n[2/2] Migration complete — finance & letters data sudah terpisah dari awal.")
    print("\n" + "=" * 50)
    print("MIGRATION COMPLETE!")
    print("=" * 50)


if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        sys.exit(1)