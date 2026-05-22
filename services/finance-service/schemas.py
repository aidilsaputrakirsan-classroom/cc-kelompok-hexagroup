from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional


class TransactionCreate(BaseModel):
    type: Literal["income", "expense"]
    category: str
    amount: float
    description: str
