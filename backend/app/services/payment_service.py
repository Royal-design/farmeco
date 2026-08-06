import hmac
import hashlib
import uuid
from datetime import datetime, timezone

import httpx

from app.core.config import settings
from app.core.exceptions import AppException
from app.models.enums import NotificationType, PaymentStatus, UserRole
from app.models.order import Order
from app.models.user import User
from app.repositories.order_repository import OrderRepository
from app.services.notification_service import NotificationService

PAYSTACK_BASE_URL = "https://api.paystack.co"
PAYSTACK_REFERENCE_PREFIX = "FECO"


class PaystackError(AppException):
    pass


class PaymentService:
    def __init__(
        self,
        order_repository: OrderRepository,
        notification_service: NotificationService | None = None,
    ):
        self.order_repository = order_repository
        self.notification_service = notification_service

    # -------------------------
    # INITIALIZE TRANSACTION
    # -------------------------
    def initialize(self, order_id: uuid.UUID, current_user: User) -> dict:
        if not settings.paystack_secret_key:
            raise AppException(
                message="Paystack is not configured",
                status_code=503,
                error_code="PAYMENT_NOT_CONFIGURED",
            )

        order = self._get_owned_order(order_id, current_user)

        if order.payment_status == PaymentStatus.PAID:
            raise AppException(
                message="This order has already been paid for",
                status_code=400,
                error_code="ORDER_ALREADY_PAID",
            )

        reference = f"{PAYSTACK_REFERENCE_PREFIX}-{uuid.uuid4().hex[:16].upper()}"

        order.payment_reference = reference
        self.order_repository.update_order(order)

        amount_kobo = int(round(float(order.total) * 100))
        callback_url = f"{settings.frontend_url.rstrip('/')}/checkout/verify"

        try:
            response = httpx.post(
                f"{PAYSTACK_BASE_URL}/transaction/initialize",
                headers={"Authorization": f"Bearer {settings.paystack_secret_key}"},
                json={
                    "email": current_user.email,
                    "amount": amount_kobo,
                    "reference": reference,
                    "callback_url": callback_url,
                    "metadata": {
                        "order_id": str(order.id),
                        "order_number": order.number,
                        "custom_fields": [
                            {"display_name": "Order", "variable_name": "order_number", "value": order.number}
                        ],
                    },
                },
                timeout=20,
            )
        except httpx.HTTPError as exc:
            raise AppException(
                message="Could not reach payment provider",
                status_code=502,
                error_code="PAYSTACK_UNREACHABLE",
            ) from exc

        if response.status_code != 200:
            raise AppException(
                message="Payment initialization failed",
                status_code=502,
                error_code="PAYMENT_INIT_FAILED",
            )

        data = response.json()
        if not data.get("status"):
            raise AppException(
                message=data.get("message") or "Payment initialization failed",
                status_code=502,
                error_code="PAYMENT_INIT_FAILED",
            )

        return {
            "authorization_url": data["data"]["authorization_url"],
            "reference": reference,
        }

    # -------------------------
    # VERIFY TRANSACTION
    # -------------------------
    def verify(self, reference: str, current_user: User) -> Order:
        if not settings.paystack_secret_key:
            raise AppException(
                message="Paystack is not configured",
                status_code=503,
                error_code="PAYMENT_NOT_CONFIGURED",
            )

        try:
            response = httpx.get(
                f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}",
                headers={"Authorization": f"Bearer {settings.paystack_secret_key}"},
                timeout=20,
            )
        except httpx.HTTPError as exc:
            raise AppException(
                message="Could not reach payment provider",
                status_code=502,
                error_code="PAYSTACK_UNREACHABLE",
            ) from exc

        if response.status_code != 200:
            raise AppException(
                message="Payment verification failed",
                status_code=502,
                error_code="PAYMENT_VERIFY_FAILED",
            )

        data = response.json()
        if not data.get("status"):
            raise AppException(
                message="Payment verification failed",
                status_code=502,
                error_code="PAYMENT_VERIFY_FAILED",
            )

        txn = data.get("data", {})
        order = self.order_repository.get_order_by_reference(reference)

        if not order:
            raise AppException(
                message="Order not found for this transaction",
                status_code=404,
                error_code="ORDER_NOT_FOUND",
            )

        if order.user_id != current_user.id and current_user.role != UserRole.ADMIN:
            raise AppException(
                message="You are not authorized to view this payment",
                status_code=403,
                error_code="FORBIDDEN",
            )

        is_success = txn.get("status") == "success"
        amount_matches = abs(int(txn.get("amount") or 0) - int(round(float(order.total) * 100))) < 100

        if is_success and amount_matches:
            self._mark_paid(order, txn)

        return order

    # -------------------------
    # HANDLE WEBHOOK
    # -------------------------
    def handle_webhook(self, payload: bytes, signature: str | None) -> Order | None:
        if not settings.paystack_secret_key:
            raise AppException(
                message="Paystack is not configured",
                status_code=503,
                error_code="PAYMENT_NOT_CONFIGURED",
            )

        if not signature:
            raise AppException(
                message="Missing webhook signature",
                status_code=400,
                error_code="INVALID_WEBHOOK",
            )

        expected = hmac.new(
            settings.paystack_secret_key.encode("utf-8"),
            payload,
            hashlib.sha512,
        ).hexdigest()

        if not hmac.compare_digest(expected, signature):
            raise AppException(
                message="Invalid webhook signature",
                status_code=401,
                error_code="INVALID_WEBHOOK",
            )

        import json
        try:
            event = json.loads(payload)
        except ValueError:
            raise AppException(
                message="Invalid webhook payload",
                status_code=400,
                error_code="INVALID_WEBHOOK",
            )

        if event.get("event") != "charge.success":
            return None

        txn = event.get("data", {})
        order = self.order_repository.get_order_by_reference(txn.get("reference", ""))

        if order and order.payment_status != PaymentStatus.PAID:
            self._mark_paid(order, txn)

        return order

    # -------------------------
    # HELPERS
    # -------------------------
    def _mark_paid(self, order: Order, txn: dict) -> Order:
        order.payment_status = PaymentStatus.PAID
        order.paid_at = datetime.now(timezone.utc)
        order.payment_reference = order.payment_reference or txn.get("reference")
        updated = self.order_repository.update_order(order)

        if self.notification_service:
            self.notification_service.notify(
                user_id=order.user_id,
                notification_type=NotificationType.PAYMENT,
                title="Payment received",
                body=f"Your payment for order {order.number} was successful.",
                link=f"/account/orders/{order.id}",
            )

        return updated

    def _get_owned_order(self, order_id: uuid.UUID, user: User) -> Order:
        order = self.order_repository.get_order_by_id(order_id)

        if not order:
            raise AppException(
                message="Order not found",
                status_code=404,
                error_code="ORDER_NOT_FOUND",
            )

        if order.user_id != user.id:
            raise AppException(
                message="You are not authorized to pay for this order",
                status_code=403,
                error_code="FORBIDDEN",
            )

        return order
