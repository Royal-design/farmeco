from uuid import UUID

from pydantic import BaseModel

from app.models.enums import PaymentStatus
from app.schemas.order import OrderResponse


class PaymentInitializeRequest(BaseModel):
    order_id: UUID


class PaymentInitializeResponse(BaseModel):
    authorization_url: str
    reference: str


class PaymentVerifyResponse(BaseModel):
    order: OrderResponse
    payment_status: PaymentStatus
