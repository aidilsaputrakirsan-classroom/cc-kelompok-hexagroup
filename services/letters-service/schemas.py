from pydantic import BaseModel

class LetterCreate(BaseModel):
    title: str
    letter_type: str
    content: str
