from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import CouponType


class CouponBase(BaseModel):
    code: str
    type: CouponType
    value: float = Field(gt=0)
    min_order: float = Field(default=0, ge=0)
    description: str | None = None
    expires_at: datetime | None = None


class CouponCreate(CouponBase):
    pass


class CouponUpdate(BaseModel):
    code: str | None = None
    type: CouponType | None = None
    value: float | None = Field(default=None, gt=0)
    min_order: float | None = Field(default=None, ge=0)
    description: str | None = None
    expires_at: datetime | None = None
    is_active: bool | None = None


class CouponResponse(CouponBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CouponValidateRequest(BaseModel):
    code: str
    subtotal: float = Field(ge=0)


class CouponValidateResponse(BaseModel):
    valid: bool
    coupon: CouponResponse | None = None
    message: str | None = None
