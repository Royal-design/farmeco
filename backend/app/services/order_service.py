import math
import random
from datetime import datetime, timezone
from uuid import UUID

from app.core.exceptions import AppException
from app.models.enums import OrderStatus, UserRole
from app.models.order import Order
from app.models.user import User
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.order import OrderCreateRequest, OrderStatusUpdate
from app.schemas.user import PaginationMeta
from app.services.coupon_service import CouponService

FREE_SHIPPING_THRESHOLD = 200000
SHIPPING_FLAT_RATE = 15000


class OrderService:
    def __init__(
        self,
        order_repository: OrderRepository,
        product_repository: ProductRepository,
        coupon_service: CouponService,
    ):
        self.order_repository = order_repository
        self.product_repository = product_repository
        self.coupon_service = coupon_service

    # -------------------------
    # GET MY ORDERS
    # -------------------------
    def get_my_orders(
        self,
        user_id: UUID,
        status: OrderStatus | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 10,
    ):
        orders, total = self.order_repository.get_orders_by_user(
            user_id,
            status=status,
            search=search,
            page=page,
            page_size=page_size,
        )

        return {
            "data": orders,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=math.ceil(total / page_size) if page_size else 0,
            ).model_dump(),
        }

    # -------------------------
    # GET RECENT ORDERS
    # -------------------------
    def get_recent_orders(self, user_id: UUID, limit: int = 4) -> list[Order]:
        return self.order_repository.get_recent_orders(user_id, limit)

    # -------------------------
    # GET ALL ORDERS (ADMIN)
    # -------------------------
    def get_all_orders(
        self,
        status: OrderStatus | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 10,
    ):
        orders, total, total_pages = self.order_repository.get_all_orders(
            status=status,
            search=search,
            page=page,
            page_size=page_size,
        )

        return {
            "data": orders,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ).model_dump(),
        }

    # -------------------------
    # GET ORDER BY ID
    # -------------------------
    def get_order_by_id(self, order_id: UUID, current_user: User) -> Order:
        order = self.order_repository.get_order_by_id(order_id)

        if not order:
            raise AppException(
                message="Order not found",
                status_code=404,
                error_code="ORDER_NOT_FOUND",
            )

        if not self._can_access_order(order, current_user):
            raise AppException(
                message="You are not authorized to view this order",
                status_code=403,
                error_code="FORBIDDEN",
            )

        return order

    # -------------------------
    # CREATE ORDER
    # -------------------------
    def create_order(self, user: User, request: OrderCreateRequest) -> Order:
        product_ids = [item.product_id for item in request.items]
        products = self.product_repository.get_products_by_ids(product_ids)
        products_by_id = {str(product.id): product for product in products}

        if len(products) != len(set(product_ids)):
            raise AppException(
                message="One or more products do not exist",
                status_code=400,
                error_code="INVALID_PRODUCTS",
            )

        items = []
        subtotal = 0.0

        for item in request.items:
            product = products_by_id.get(str(item.product_id))

            if product is None or not product.is_active:
                raise AppException(
                    message="One or more products are no longer available",
                    status_code=400,
                    error_code="PRODUCT_UNAVAILABLE",
                )

            if product.stock < item.quantity:
                raise AppException(
                    message=f"Insufficient stock for {product.name}",
                    status_code=400,
                    error_code="INSUFFICIENT_STOCK",
                )

            price = float(product.price)
            subtotal += price * item.quantity

            items.append({
                "product_id": str(product.id),
                "slug": product.slug,
                "name": product.name,
                "image": (product.images or [None])[0],
                "price": price,
                "quantity": item.quantity,
                "seller_id": str(product.seller_id) if product.seller_id else None,
            })

        discount = 0.0
        coupon_code = None
        if request.coupon_code:
            validation = self.coupon_service.validate(
                request.coupon_code,
                subtotal,
            )
            if not validation.valid or validation.coupon is None:
                raise AppException(
                    message=validation.message or "Invalid coupon code",
                    status_code=400,
                    error_code="INVALID_COUPON",
                )
            coupon = validation.coupon
            coupon_code = coupon.code
            discount = (
                subtotal * (coupon.value / 100)
                if coupon.type == "percent"
                else min(coupon.value, subtotal)
            )

        shipping = 0.0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_FLAT_RATE
        tax = 0.0
        total = max(0.0, subtotal - discount) + shipping

        db_order = Order(
            number=self._generate_order_number(),
            user_id=user.id,
            items=items,
            shipping_address=request.shipping_address.model_dump(),
            subtotal=round(subtotal, 2),
            shipping=shipping,
            tax=tax,
            discount=round(discount, 2),
            total=round(total, 2),
            payment_method=request.payment_method,
            coupon_code=coupon_code,
            notes=request.notes,
            status=OrderStatus.PENDING,
        )

        created = self.order_repository.create_order(db_order)

        for item in request.items:
            self.product_repository.record_sale(item.product_id, item.quantity)

        return created

    # -------------------------
    # CANCEL ORDER
    # -------------------------
    def cancel_order(self, order_id: UUID, current_user: User) -> Order:
        order = self.order_repository.get_order_by_id(order_id)

        if not order:
            raise AppException(
                message="Order not found",
                status_code=404,
                error_code="ORDER_NOT_FOUND",
            )

        if order.user_id != current_user.id:
            raise AppException(
                message="You are not authorized to cancel this order",
                status_code=403,
                error_code="FORBIDDEN",
            )

        if order.status not in (OrderStatus.PENDING, OrderStatus.CONFIRMED):
            raise AppException(
                message="This order can no longer be cancelled",
                status_code=400,
                error_code="ORDER_NOT_CANCELLABLE",
            )

        order.status = OrderStatus.CANCELLED
        updated = self.order_repository.update_order(order)

        for item in order.items or []:
            if item.get("product_id"):
                self.product_repository.restore_sale(
                    UUID(item["product_id"]),
                    item.get("quantity", 0),
                )

        return updated

    # -------------------------
    # UPDATE ORDER STATUS (ADMIN / SELLER)
    # -------------------------
    def update_order_status(
        self,
        order_id: UUID,
        current_user: User,
        payload: OrderStatusUpdate,
    ) -> Order:
        order = self.order_repository.get_order_by_id(order_id)

        if not order:
            raise AppException(
                message="Order not found",
                status_code=404,
                error_code="ORDER_NOT_FOUND",
            )

        if not self._can_manage_order(order, current_user):
            raise AppException(
                message="You are not authorized to manage this order",
                status_code=403,
                error_code="FORBIDDEN",
            )

        order.status = payload.status

        if payload.status == OrderStatus.SHIPPED:
            order.eta = "3-5 days"

        if payload.status == OrderStatus.DELIVERED:
            order.delivered_at = datetime.now(timezone.utc)

        return self.order_repository.update_order(order)

    # -------------------------
    # HELPERS
    # -------------------------
    def _generate_order_number(self) -> str:
        while True:
            number = f"PC-{random.randint(10000, 99999)}"
            if not self.order_repository.get_order_by_number(number):
                return number

    def _can_access_order(self, order: Order, user: User) -> bool:
        if order.user_id == user.id or user.role == UserRole.ADMIN:
            return True
        return self._order_belongs_to_seller(order, user)

    def _can_manage_order(self, order: Order, user: User) -> bool:
        if user.role == UserRole.ADMIN:
            return True
        return user.role == UserRole.SELLER and self._order_belongs_to_seller(order, user)

    def _order_belongs_to_seller(self, order: Order, user: User) -> bool:
        for item in order.items or []:
            if str(item.get("seller_id", "")) == str(user.id):
                return True
        return False
