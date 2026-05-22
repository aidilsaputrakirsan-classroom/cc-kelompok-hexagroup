from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional

class LetterCreate(BaseModel):
    title: str
    letter_type: str
    content: str
