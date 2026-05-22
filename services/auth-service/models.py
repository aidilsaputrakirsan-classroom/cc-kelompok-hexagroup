from sqlalchemy import Column, Integer, String, DateTime, Enum
from database import Base
from datetime import datetime
import enum


class UserRole(str, enum.Enum):
    ketua = "ketua"
    bendahara = "bendahara"
    sekretaris = "sekretaris"
    anggota = "anggota"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.anggota)
    created_at = Column(DateTime, default=datetime.utcnow)
