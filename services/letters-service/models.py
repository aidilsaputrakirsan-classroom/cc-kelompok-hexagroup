from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from database import Base
from datetime import datetime
import enum


class LetterStatus(str, enum.Enum):
    draft = "draft"
    submitted = "submitted"
    approved = "approved"
    rejected = "rejected"

class Letter(Base):
    __tablename__ = "letters"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    letter_type = Column(String)
    content = Column(String)
    status = Column(Enum(LetterStatus), default=LetterStatus.draft)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
