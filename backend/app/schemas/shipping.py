from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.shipping_setting import ShippingSetting


class ShippingSettingResponse(BaseModel):
    id: UUID
    free_shipping_threshold: float
    flat_rate: float
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ShippingSettingUpdate(BaseModel):
    free_shipping_threshold: float = Field(ge=0)
    flat_rate: float = Field(ge=0)
