from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Literal, Optional
import re


class UserRoleEnum(str):
    ketua = "ketua"
    bendahara = "bendahara"
    sekretaris = "sekretaris"
    anggota = "anggota"


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
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreateByKetua(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Literal["bendahara", "sekretaris", "anggota"] = "anggota"

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


class TransactionCreate(BaseModel):
    type: Literal["income", "expense"]
    category: str
    amount: float
    description: str


class TransactionResponse(BaseModel):
    id: int
    type: str
    category: str
    amount: float
    description: str
    created_at: datetime

    class Config:
        from_attributes = True


class LetterCreate(BaseModel):
    title: str
    letter_type: str
    content: str


class LetterResponse(BaseModel):
    id: int
    title: str
    letter_type: str
    content: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RefreshToken(BaseModel):
    refresh_token: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[Literal["ketua", "bendahara", "sekretaris", "anggota"]] = None
