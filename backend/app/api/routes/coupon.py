from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.dependencies.auth import get_current_admin_user
from app.api.dependencies.services import get_coupon_service
from app.schemas.coupon import (
    CouponCreate,
    CouponResponse,
    CouponUpdate,
    CouponValidateRequest,
    CouponValidateResponse,
)
from app.schemas.response import MessageResponse, SuccessResponse
from app.services.coupon_service import CouponService

router = APIRouter()


# -------------------------
# VALIDATE COUPON (PUBLIC)
# -------------------------
@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon(
    payload: CouponValidateRequest,
    coupon_service: CouponService = Depends(get_coupon_service),
):
    return coupon_service.validate_request(payload)


# -------------------------
# GET ALL COUPONS (ADMIN)
# -------------------------
@router.get(
    "/",
    response_model=SuccessResponse[list[CouponResponse]],
    dependencies=[Depends(get_current_admin_user)],
)
def get_coupons(
    coupon_service: CouponService = Depends(get_coupon_service),
):
    coupons = coupon_service.get_all(active_only=False)

    return SuccessResponse(
        message="Coupons retrieved successfully",
        data=coupons,
    )


# -------------------------
# CREATE COUPON (ADMIN)
# -------------------------
@router.post(
    "/",
    response_model=SuccessResponse[CouponResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin_user)],
)
def create_coupon(
    payload: CouponCreate,
    coupon_service: CouponService = Depends(get_coupon_service),
):
    coupon = coupon_service.create_coupon(payload)

    return SuccessResponse(
        message="Coupon created successfully",
        data=coupon,
    )


# -------------------------
# UPDATE COUPON (ADMIN)
# -------------------------
@router.put(
    "/{coupon_id}",
    response_model=SuccessResponse[CouponResponse],
    dependencies=[Depends(get_current_admin_user)],
)
def update_coupon(
    coupon_id: UUID,
    payload: CouponUpdate,
    coupon_service: CouponService = Depends(get_coupon_service),
):
    coupon = coupon_service.update_coupon(coupon_id, payload)

    return SuccessResponse(
        message="Coupon updated successfully",
        data=coupon,
    )


# -------------------------
# DELETE COUPON (ADMIN)
# -------------------------
@router.delete(
    "/{coupon_id}",
    response_model=MessageResponse,
    dependencies=[Depends(get_current_admin_user)],
)
def delete_coupon(
    coupon_id: UUID,
    coupon_service: CouponService = Depends(get_coupon_service),
):
    coupon_service.delete_coupon(coupon_id)

    return MessageResponse(message="Coupon deleted successfully")
