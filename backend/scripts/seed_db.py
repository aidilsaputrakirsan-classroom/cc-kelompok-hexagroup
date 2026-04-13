"""
Initialize database: create tables and seed initial data
Run: python init_db.py
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import models
import crud
import schemas
from database import Base, SessionLocal

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def create_tables():
    """Create all tables in database"""
    print("[1] Creating tables...")
    try:
        engine = create_engine(DATABASE_URL)
        Base.metadata.drop_all(bind=engine)
        print("    - Dropped existing tables")
        Base.metadata.create_all(bind=engine)
        print("    - Tables created successfully ✓")
        engine.dispose()
        return True
    except Exception as e:
        print(f"    - Error creating tables: {e}")
        return False


def seed_users(db: Session):
    """Seed initial users"""
    print("[2] Seeding users...")

    users_data = [
        {"email": "ketua@cloud.com",     "password": "Ketua123",     "full_name": "Ketua Organisasi",  "role": "ketua"},
        {"email": "bendahara@cloud.com", "password": "Bendahara123", "full_name": "Bendahara Org",     "role": "bendahara"},
        {"email": "sekretaris@cloud.com","password": "Sekretaris123","full_name": "Sekretaris Org",    "role": "sekretaris"},
        {"email": "anggota@cloud.com",   "password": "Anggota123",   "full_name": "Anggota Biasa",     "role": "anggota"},
    ]

    for user_data in users_data:
        existing = db.query(models.User).filter(models.User.email == user_data["email"]).first()
        if not existing:
            user = crud.create_user(db, user_data["email"], user_data["password"], user_data["full_name"], role=user_data["role"])
            print(f"    - Created user: {user.email} ({user.role})")
        else:
            print(f"    - User already exists: {user_data['email']}")

    print("    - Users seeded ✓")


def seed_transactions(db: Session):
    """Seed initial transactions"""
    print("[3] Seeding transactions...")

    transactions_data = [
        {"type": "income",  "category": "Iuran",     "amount": 5000000, "description": "Iuran bulanan anggota"},
        {"type": "expense", "category": "Konsumsi",  "amount": 500000,  "description": "Konsumsi rapat"},
        {"type": "expense", "category": "Transport", "amount": 200000,  "description": "Transport kegiatan"},
        {"type": "income",  "category": "Donasi",    "amount": 1000000, "description": "Donasi sponsor"},
    ]

    for trans_data in transactions_data:
        transaction = models.Transaction(
            type=trans_data["type"],
            category=trans_data["category"],
            amount=trans_data["amount"],
            description=trans_data["description"],
        )
        db.add(transaction)
        print(f"    - Created transaction: {trans_data['category']} ({trans_data['type']})")

    db.commit()
    print("    - Transactions seeded ✓")


def seed_letters(db: Session):
    """Seed initial letters"""
    print("[4] Seeding letters...")

    letters_data = [
        {"title": "Surat Undangan Rapat",  "letter_type": "other",     "content": "Mengundang seluruh anggota untuk hadir dalam rapat bulanan.", "status": "draft"},
        {"title": "Surat Permohonan Dana", "letter_type": "other",     "content": "Permohonan dana kegiatan organisasi semester ini.",           "status": "submitted"},
        {"title": "Surat Keputusan",       "letter_type": "promotion", "content": "Surat keputusan pengangkatan pengurus baru organisasi.",       "status": "approved"},
    ]

    for letter_data in letters_data:
        letter = models.Letter(
            title=letter_data["title"],
            letter_type=letter_data["letter_type"],
            content=letter_data["content"],
            status=letter_data["status"],
        )
        db.add(letter)
        print(f"    - Created letter: {letter_data['title']} ({letter_data['status']})")

    db.commit()
    print("    - Letters seeded ✓")


def main():
    """Main initialization function"""
    print("\n" + "="*50)
    print("DATABASE INITIALIZATION")
    print("="*50 + "\n")

    if not create_tables():
        print("\n❌ Failed to create tables")
        return

    db = SessionLocal()

    try:
        seed_users(db)
        seed_transactions(db)
        seed_letters(db)

        print("\n" + "="*50)
        print("✓ Database initialized successfully!")
        print("="*50 + "\n")
        print("Credentials:")
        print("  ketua@cloud.com      / Ketua123")
        print("  bendahara@cloud.com  / Bendahara123")
        print("  sekretaris@cloud.com / Sekretaris123")
        print("  anggota@cloud.com    / Anggota123")
        print("\nRun: python -m uvicorn main:app --reload\n")

    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
