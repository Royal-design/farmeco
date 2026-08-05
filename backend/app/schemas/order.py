from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import OrderStatus, PaymentMethod


class OrderItemRequest(BaseModel):
    product_id: UUID
    quantity: int = Field(ge=1)


class ShippingAddressRequest(BaseModel):
    full_name: str
    phone: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    postal_code: str
    country: str


class OrderCreateRequest(BaseModel):
    items: list[OrderItemRequest] = Field(min_length=1)
    payment_method: PaymentMethod
    coupon_code: str | None = None
    shipping_address: ShippingAddressRequest
    notes: str | None = Field(default=None, max_length=500)


class OrderItemResponse(BaseModel):
    product_id: UUID
    slug: str
    name: str
    image: str | None = None
    price: float
    quantity: int


class ShippingAddressResponse(BaseModel):
    full_name: str
    phone: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    postal_code: str
    country: str


class OrderResponse(BaseModel):
    id: UUID
    number: str
    status: OrderStatus
    items: list[OrderItemResponse]
    subtotal: float
    shipping: float
    tax: float
    discount: float
    total: float
    payment_method: PaymentMethod
    coupon_code: str | None
    shipping_address: ShippingAddressResponse
    notes: str | None
    eta: str | None
    delivered_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
