from fastapi import APIRouter, Depends, status

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.services import (
    get_payment_method_service,
    get_refresh_token_service,
    get_user_service,
)
from app.models.user import User
from app.schemas.account import (
    NotificationPreferencesResponse,
    NotificationPreferencesUpdate,
    PaymentMethodCreate,
    PaymentMethodResponse,
    SecuritySessionResponse,
    SecuritySettingsResponse,
    TwoFactorToggle,
)
from app.schemas.response import MessageResponse, SuccessResponse
from app.services.payment_method_service import PaymentMethodService
from app.services.refresh_token_service import RefreshTokenService
from app.services.user_service import UserService

router = APIRouter(dependencies=[Depends(get_current_user)])


# -------------------------
# NOTIFICATION PREFERENCES
# -------------------------
@router.get(
    "/settings/notifications",
    response_model=SuccessResponse[NotificationPreferencesResponse],
)
def get_notifications(
    current_user: User = Depends(get_current_user),
):
    prefs = current_user.preferences or {}

    return SuccessResponse(
        message="Notification preferences retrieved successfully",
        data=NotificationPreferencesResponse(
            order_updates=prefs.get("order_updates", False),
            price_drops=prefs.get("price_drops", False),
            new_arrivals=prefs.get("new_arrivals", False),
            weekly_digest=prefs.get("weekly_digest", False),
        ),
    )


@router.put(
    "/settings/notifications",
    response_model=SuccessResponse[NotificationPreferencesResponse],
)
def update_notifications(
    payload: NotificationPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    updates = payload.model_dump(exclude_unset=True)
    current_user.preferences = {
        **(current_user.preferences or {}),
        **updates,
    }
    updated = user_service.save_user(current_user)
    prefs = updated.preferences or {}

    return SuccessResponse(
        message="Notification preferences updated successfully",
        data=NotificationPreferencesResponse(
            order_updates=prefs.get("order_updates", False),
            price_drops=prefs.get("price_drops", False),
            new_arrivals=prefs.get("new_arrivals", False),
            weekly_digest=prefs.get("weekly_digest", False),
        ),
    )


# -------------------------
# SECURITY SETTINGS
# -------------------------
@router.get(
    "/settings/security",
    response_model=SuccessResponse[SecuritySettingsResponse],
)
def get_security(
    current_user: User = Depends(get_current_user),
    refresh_token_service: RefreshTokenService = Depends(get_refresh_token_service),
):
    sessions = refresh_token_service.get_active_sessions(current_user.id)

    return SuccessResponse(
        message="Security settings retrieved successfully",
        data=SecuritySettingsResponse(
            two_factor=current_user.two_factor_enabled,
            sessions=[
                SecuritySessionResponse(
                    id=session.id,
                    device=session.user_agent,
                    location=session.ip_address,
                    active=not session.revoked,
                    last_active=session.created_at,
                )
                for session in sessions
            ],
        ),
    )


@router.put(
    "/settings/security/two-factor",
    response_model=MessageResponse,
)
def toggle_two_factor(
    payload: TwoFactorToggle,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    current_user.two_factor_enabled = payload.enabled
    user_service.save_user(current_user)

    return MessageResponse(
        message=(
            "Two-factor authentication enabled"
            if payload.enabled
            else "Two-factor authentication disabled"
        )
    )


# -------------------------
# PAYMENT METHODS
# -------------------------
@router.get(
    "/payment-methods",
    response_model=SuccessResponse[list[PaymentMethodResponse]],
)
def get_payment_methods(
    current_user: User = Depends(get_current_user),
    payment_method_service: PaymentMethodService = Depends(get_payment_method_service),
):
    methods = payment_method_service.get_by_user(current_user.id)

    return SuccessResponse(
        message="Payment methods retrieved successfully",
        data=methods,
    )


@router.post(
    "/payment-methods",
    response_model=SuccessResponse[PaymentMethodResponse],
    status_code=status.HTTP_201_CREATED,
)
def add_payment_method(
    payload: PaymentMethodCreate,
    current_user: User = Depends(get_current_user),
    payment_method_service: PaymentMethodService = Depends(get_payment_method_service),
):
    method = payment_method_service.add(current_user.id, payload)

    return SuccessResponse(
        message="Payment method added successfully",
        data=method,
    )
