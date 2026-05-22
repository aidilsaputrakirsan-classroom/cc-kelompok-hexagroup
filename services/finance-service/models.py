from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)        # "income" or "expense"
    category = Column(String)
    amount = Column(Float)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
