from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal, Optional
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


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[Literal["ketua", "bendahara", "sekretaris", "anggota"]] = None


class RefreshToken(BaseModel):
    refresh_token: str


class TokenVerifyRequest(BaseModel):
    token: str


class TokenVerifyResponse(BaseModel):
    valid: bool
    email: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[int] = None
