from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import AuthProvider, UserRole


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    avatar: str | None = None


class RegisterRequest(UserBase):
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserUpdateRequest(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: dict | None = None
    preferences: dict | None = None


class UserRoleUpdateRequest(BaseModel):
    role: UserRole


class UserResponse(UserBase):
    id: UUID
    role: UserRole
    provider: AuthProvider
    address: dict = Field(default_factory=dict)
    preferences: dict = Field(default_factory=dict)
    is_active: bool
    is_verified: bool
    two_factor_enabled: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginationMeta(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=10, description="JWT refresh token")
