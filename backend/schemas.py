from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Literal
import re


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str

    class Config:
        from_attributes = True


class TransactionCreate(BaseModel):
    type: Literal["income", "expense"]
    amount: float
    description: str


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    type: str
    amount: float
    description: str
    date: datetime

    class Config:
        from_attributes = True


class LetterCreate(BaseModel):
    title: str
    content: str


class LetterResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
