from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies.auth import get_current_admin_user, get_current_user
from app.api.dependencies.services import get_order_service
from app.core.exceptions import AppException
from app.models.enums import OrderStatus, UserRole
from app.models.user import User
from app.schemas.order import (
    OrderCreateRequest,
    OrderResponse,
    OrderStatusUpdate,
)
from app.schemas.response import SuccessResponse
from app.services.order_service import OrderService

router = APIRouter()


# -------------------------
# GET MY ORDERS
# -------------------------
@router.get("", response_model=SuccessResponse[list[OrderResponse]])
def get_my_orders(
    current_user: Annotated[User, Depends(get_current_user)],
    order_service: Annotated[OrderService, Depends(get_order_service)],
    status_filter: OrderStatus | None = Query(None, alias="status"),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    result = order_service.get_my_orders(
        user_id=current_user.id,
        status=status_filter,
        search=search,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Orders retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# GET RECENT ORDERS
# -------------------------
@router.get("/recent", response_model=SuccessResponse[list[OrderResponse]])
def get_recent_orders(
    current_user: Annotated[User, Depends(get_current_user)],
    order_service: Annotated[OrderService, Depends(get_order_service)],
    limit: int = Query(4, ge=1, le=50),
):
    orders = order_service.get_recent_orders(current_user.id, limit)

    return SuccessResponse(
        message="Recent orders retrieved successfully",
        data=orders,
    )


# -------------------------
# GET ALL ORDERS (ADMIN)
# -------------------------
@router.get(
    "/all",
    response_model=SuccessResponse[list[OrderResponse]],
    dependencies=[Depends(get_current_admin_user)],
)
def get_all_orders(
    order_service: Annotated[OrderService, Depends(get_order_service)],
    status_filter: OrderStatus | None = Query(None, alias="status"),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    result = order_service.get_all_orders(
        status=status_filter,
        search=search,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Orders retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# GET SELLER ORDERS
# -------------------------
@router.get("/seller", response_model=SuccessResponse[list[OrderResponse]])
def get_seller_orders(
    current_user: Annotated[User, Depends(get_current_user)],
    order_service: Annotated[OrderService, Depends(get_order_service)],
    status_filter: OrderStatus | None = Query(None, alias="status"),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    if current_user.role not in (UserRole.SELLER, UserRole.ADMIN):
        raise AppException(
            message="Seller privileges required",
            status_code=403,
            error_code="FORBIDDEN",
        )

    result = order_service.get_seller_orders(
        seller_id=current_user.id,
        status=status_filter,
        search=search,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Orders retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# GET ORDER BY ID
# -------------------------
@router.get("/{order_id}", response_model=SuccessResponse[OrderResponse])
def get_order(
    order_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    order_service: Annotated[OrderService, Depends(get_order_service)],
):
    order = order_service.get_order_by_id(order_id, current_user)

    return SuccessResponse(
        message="Order retrieved successfully",
        data=order,
    )


# -------------------------
# CREATE ORDER
# -------------------------
@router.post(
    "",
    response_model=SuccessResponse[OrderResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_order(
    current_user: Annotated[User, Depends(get_current_user)],
    order_service: Annotated[OrderService, Depends(get_order_service)],
    payload: OrderCreateRequest,
):
    order = order_service.create_order(current_user, payload)

    return SuccessResponse(
        message="Order placed successfully",
        data=order,
    )


# -------------------------
# CANCEL ORDER
# -------------------------
@router.post("/{order_id}/cancel", response_model=SuccessResponse[OrderResponse])
def cancel_order(
    order_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    order_service: Annotated[OrderService, Depends(get_order_service)],
):
    order = order_service.cancel_order(order_id, current_user)

    return SuccessResponse(
        message="Order cancelled successfully",
        data=order,
    )


# -------------------------
# UPDATE ORDER STATUS (ADMIN / SELLER)
# -------------------------
@router.patch("/{order_id}/status", response_model=SuccessResponse[OrderResponse])
def update_order_status(
    order_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    order_service: Annotated[OrderService, Depends(get_order_service)],
    payload: OrderStatusUpdate,
):
    order = order_service.update_order_status(order_id, current_user, payload)

    return SuccessResponse(
        message="Order status updated successfully",
        data=order,
    )
