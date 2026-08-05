from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class NotificationPreferencesUpdate(BaseModel):
    order_updates: bool | None = None
    price_drops: bool | None = None
    new_arrivals: bool | None = None
    weekly_digest: bool | None = None


class NotificationPreferencesResponse(BaseModel):
    order_updates: bool = False
    price_drops: bool = False
    new_arrivals: bool = False
    weekly_digest: bool = False


class TwoFactorToggle(BaseModel):
    enabled: bool


class SecuritySessionResponse(BaseModel):
    id: UUID
    device: str | None = None
    location: str | None = None
    active: bool = True
    last_active: datetime


class SecuritySettingsResponse(BaseModel):
    two_factor: bool = False
    sessions: list[SecuritySessionResponse] = Field(default_factory=list)


class PaymentMethodCreate(BaseModel):
    number: str = Field(min_length=12, max_length=19)
    expiry: str
    is_default: bool = False


class PaymentMethodResponse(BaseModel):
    id: UUID
    brand: str
    last4: str
    expiry: str
    is_default: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
