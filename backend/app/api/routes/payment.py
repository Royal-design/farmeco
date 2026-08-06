from typing import Annotated

from fastapi import APIRouter, Depends, Request, status

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.services import get_payment_service
from app.core.exceptions import AppException
from app.models.user import User
from app.schemas.order import OrderResponse
from app.schemas.payment import (
    PaymentInitializeRequest,
    PaymentInitializeResponse,
    PaymentVerifyResponse,
)
from app.schemas.response import MessageResponse, SuccessResponse
from app.services.payment_service import PaymentService

router = APIRouter()


# -------------------------
# INITIALIZE PAYMENT
# -------------------------
@router.post(
    "/initialize",
    response_model=SuccessResponse[PaymentInitializeResponse],
    status_code=status.HTTP_201_CREATED,
)
def initialize_payment(
    payload: PaymentInitializeRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    payment_service: Annotated[PaymentService, Depends(get_payment_service)],
):
    result = payment_service.initialize(payload.order_id, current_user)

    return SuccessResponse(
        message="Payment initialized successfully",
        data=PaymentInitializeResponse(
            authorization_url=result["authorization_url"],
            reference=result["reference"],
        ),
    )


# -------------------------
# VERIFY PAYMENT
# -------------------------
@router.get("/verify/{reference}", response_model=SuccessResponse[PaymentVerifyResponse])
def verify_payment(
    reference: str,
    current_user: Annotated[User, Depends(get_current_user)],
    payment_service: Annotated[PaymentService, Depends(get_payment_service)],
):
    order = payment_service.verify(reference, current_user)

    return SuccessResponse(
        message="Payment verified successfully",
        data=PaymentVerifyResponse(
            order=order,
            payment_status=order.payment_status,
        ),
    )


# -------------------------
# PAYSTACK WEBHOOK
# -------------------------
@router.post("/webhook", response_model=MessageResponse)
async def paystack_webhook(
    request: Request,
    payment_service: Annotated[PaymentService, Depends(get_payment_service)],
):
    signature = request.headers.get("x-paystack-signature")
    payload = await request.body()

    if not payload:
        raise AppException(
            message="Empty webhook payload",
            status_code=400,
            error_code="INVALID_WEBHOOK",
        )

    payment_service.handle_webhook(payload, signature)

    return MessageResponse(message="Webhook received")
