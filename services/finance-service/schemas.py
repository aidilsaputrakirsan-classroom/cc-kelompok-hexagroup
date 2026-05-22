from pydantic import BaseModel
from typing import Literal


class TransactionCreate(BaseModel):
    type: Literal["income", "expense"]
    category: str
    amount: float
    description: str
