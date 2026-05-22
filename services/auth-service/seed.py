from database import SessionLocal, Base, engine
import models
import crud


def seed_users():
    db = SessionLocal()

    users = [
        ("ketua@cloud.com", "Ketua123", "Ketua Organisasi", "ketua"),
        ("bendahara@cloud.com", "Bendahara123", "Bendahara Org", "bendahara"),
        ("sekretaris@cloud.com", "Sekretaris123", "Sekretaris Org", "sekretaris"),
        ("anggota@cloud.com", "Anggota123", "Anggota Biasa", "anggota"),
    ]

    for email, pw, name, role in users:
        exists = db.query(models.User).filter_by(email=email).first()
        if not exists:
            crud.create_user(db, email, pw, name, role)

    db.close()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_users()
