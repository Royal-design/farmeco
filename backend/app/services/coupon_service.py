from datetime import datetime, timezone
from uuid import UUID

from app.core.exceptions import AppException
from app.models.coupon import Coupon
from app.repositories.coupon_repository import CouponRepository
from app.schemas.coupon import (
    CouponCreate,
    CouponUpdate,
    CouponValidateRequest,
    CouponValidateResponse,
)


class CouponService:
    def __init__(self, repository: CouponRepository):
        self.repository = repository

    # -------------------------
    # GET ALL COUPONS (ADMIN)
    # -------------------------
    def get_all(self, active_only: bool = True) -> list[Coupon]:
        return self.repository.get_all(active_only=active_only)

    # -------------------------
    # GET COUPON BY ID
    # -------------------------
    def get_coupon_by_id(self, coupon_id: UUID) -> Coupon:
        coupon = self.repository.get_by_id(coupon_id)

        if not coupon:
            raise AppException(
                message="Coupon not found",
                status_code=404,
                error_code="COUPON_NOT_FOUND",
            )

        return coupon

    # -------------------------
    # VALIDATE COUPON
    # -------------------------
    def validate(self, code: str, subtotal: float) -> CouponValidateResponse:
        coupon = self.repository.get_by_code(code.strip())

        if not coupon or not coupon.is_active:
            return CouponValidateResponse(
                valid=False,
                message="That coupon code doesn't exist.",
            )

        if coupon.expires_at:
            expires_at = coupon.expires_at
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at <= datetime.now(timezone.utc):
                return CouponValidateResponse(
                    valid=False,
                    message="This coupon has expired.",
                )

        if subtotal < float(coupon.min_order):
            return CouponValidateResponse(
                valid=False,
                message=f"This coupon requires a minimum order of ₦{float(coupon.min_order):,.0f}.",
            )

        return CouponValidateResponse(
            valid=True,
            coupon=coupon,
            message="Coupon applied successfully.",
        )

    # -------------------------
    # VALIDATE REQUEST WRAPPER
    # -------------------------
    def validate_request(self, request: CouponValidateRequest) -> CouponValidateResponse:
        return self.validate(request.code, request.subtotal)

    # -------------------------
    # CREATE COUPON
    # -------------------------
    def create_coupon(self, coupon: CouponCreate) -> Coupon:
        code = coupon.code.strip().upper()

        if self.repository.get_by_code(code):
            raise AppException(
                message="Coupon with this code already exists",
                status_code=409,
                error_code="COUPON_ALREADY_EXISTS",
            )

        db_coupon = Coupon(
            **coupon.model_dump(exclude={"code"}),
            code=code,
        )

        return self.repository.create_coupon(db_coupon)

    # -------------------------
    # UPDATE COUPON
    # -------------------------
    def update_coupon(self, coupon_id: UUID, coupon: CouponUpdate) -> Coupon:
        db_coupon = self.get_coupon_by_id(coupon_id)

        updates = coupon.model_dump(exclude_unset=True)

        if "code" in updates and updates["code"]:
            code = updates["code"].strip().upper()
            existing = self.repository.get_by_code(code)
            if existing and existing.id != coupon_id:
                raise AppException(
                    message="Coupon with this code already exists",
                    status_code=409,
                    error_code="COUPON_ALREADY_EXISTS",
                )
            updates["code"] = code

        for key, value in updates.items():
            setattr(db_coupon, key, value)

        return self.repository.update_coupon(db_coupon)

    # -------------------------
    # DELETE COUPON
    # -------------------------
    def delete_coupon(self, coupon_id: UUID) -> Coupon:
        db_coupon = self.get_coupon_by_id(coupon_id)
        return self.repository.delete_coupon(db_coupon)
