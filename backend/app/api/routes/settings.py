from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.auth import get_current_admin_user
from app.api.dependencies.services import get_shipping_setting_service
from app.models.user import User
from app.schemas.response import SuccessResponse
from app.schemas.shipping import ShippingSettingResponse, ShippingSettingUpdate
from app.services.shipping_setting_service import ShippingSettingService

router = APIRouter()


# -------------------------
# GET SHIPPING SETTINGS (PUBLIC)
# -------------------------
@router.get("/shipping", response_model=SuccessResponse[ShippingSettingResponse])
def get_shipping_settings(
    shipping_service: Annotated[ShippingSettingService, Depends(get_shipping_setting_service)],
):
    settings = shipping_service.get()

    return SuccessResponse(
        message="Shipping settings retrieved successfully",
        data=settings,
    )


# -------------------------
# UPDATE SHIPPING SETTINGS (ADMIN)
# -------------------------
@router.put("/shipping", response_model=SuccessResponse[ShippingSettingResponse])
def update_shipping_settings(
    payload: ShippingSettingUpdate,
    current_admin: Annotated[User, Depends(get_current_admin_user)],
    shipping_service: Annotated[ShippingSettingService, Depends(get_shipping_setting_service)],
):
    settings = shipping_service.update(
        current_admin,
        free_shipping_threshold=payload.free_shipping_threshold,
        flat_rate=payload.flat_rate,
    )

    return SuccessResponse(
        message="Shipping settings updated successfully",
        data=settings,
    )
