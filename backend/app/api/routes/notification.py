from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.services import get_notification_service
from app.models.user import User
from app.schemas.notification import NotificationResponse, UnreadCountResponse
from app.schemas.response import MessageResponse, SuccessResponse
from app.services.notification_service import NotificationService

router = APIRouter()


# -------------------------
# GET MY NOTIFICATIONS
# -------------------------
@router.get("", response_model=SuccessResponse[list[NotificationResponse]])
def get_my_notifications(
    current_user: Annotated[User, Depends(get_current_user)],
    notification_service: Annotated[NotificationService, Depends(get_notification_service)],
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    result = notification_service.get_my_notifications(
        user_id=current_user.id,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Notifications retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# UNREAD COUNT
# -------------------------
@router.get("/unread-count", response_model=SuccessResponse[UnreadCountResponse])
def get_unread_count(
    current_user: Annotated[User, Depends(get_current_user)],
    notification_service: Annotated[NotificationService, Depends(get_notification_service)],
):
    count = notification_service.unread_count(current_user.id)

    return SuccessResponse(
        message="Unread count retrieved successfully",
        data=UnreadCountResponse(count=count),
    )


# -------------------------
# MARK ONE READ
# -------------------------
@router.patch("/{notification_id}/read", response_model=SuccessResponse[NotificationResponse])
def mark_read(
    notification_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    notification_service: Annotated[NotificationService, Depends(get_notification_service)],
):
    notification = notification_service.mark_read(notification_id, current_user)

    return SuccessResponse(
        message="Notification marked as read",
        data=notification,
    )


# -------------------------
# MARK ALL READ
# -------------------------
@router.patch("/read-all", response_model=MessageResponse)
def mark_all_read(
    current_user: Annotated[User, Depends(get_current_user)],
    notification_service: Annotated[NotificationService, Depends(get_notification_service)],
):
    notification_service.mark_all_read(current_user.id)

    return MessageResponse(message="All notifications marked as read")
