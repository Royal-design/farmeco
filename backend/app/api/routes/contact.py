from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies.auth import (
    get_current_staff_user,
    get_current_user,
    get_optional_current_user,
)
from app.api.dependencies.services import get_contact_service
from app.models.enums import ContactStatus
from app.models.user import User
from app.schemas.contact import (
    ContactMessageCreate,
    ContactMessageDetailResponse,
    ContactMessageResponse,
    ContactMessageSummaryResponse,
    ContactReplyRequest,
    NewsletterResponse,
    NewsletterSubscribeRequest,
)
from app.schemas.response import SuccessResponse
from app.services.contact_service import ContactService

router = APIRouter()


# -------------------------
# SEND CONTACT MESSAGE (PUBLIC / OPTIONAL AUTH)
# -------------------------
@router.post(
    "/messages",
    response_model=ContactMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def send_message(
    payload: ContactMessageCreate,
    current_user: Annotated[User | None, Depends(get_optional_current_user)],
    contact_service: Annotated[ContactService, Depends(get_contact_service)],
):
    return contact_service.send_message(payload, current_user)


# -------------------------
# GET MY MESSAGES (USER)
# -------------------------
@router.get("/messages/my", response_model=SuccessResponse[list[ContactMessageSummaryResponse]])
def get_my_messages(
    current_user: Annotated[User, Depends(get_current_user)],
    contact_service: Annotated[ContactService, Depends(get_contact_service)],
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    result = contact_service.get_my_messages(
        user_id=current_user.id,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Messages retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# GET ALL MESSAGES (ADMIN / SELLER)
# -------------------------
@router.get("/messages", response_model=SuccessResponse[list[ContactMessageSummaryResponse]])
def get_all_messages(
    current_staff: Annotated[User, Depends(get_current_staff_user)],
    contact_service: Annotated[ContactService, Depends(get_contact_service)],
    status_filter: ContactStatus | None = Query(None, alias="status"),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
):
    result = contact_service.get_all_messages(
        status=status_filter,
        search=search,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Messages retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# GET MESSAGE BY ID (OWNER OR STAFF)
# -------------------------
@router.get("/messages/{message_id}", response_model=SuccessResponse[ContactMessageDetailResponse])
def get_message(
    message_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    contact_service: Annotated[ContactService, Depends(get_contact_service)],
):
    message = contact_service.get_message_by_id(message_id, current_user)

    return SuccessResponse(
        message="Message retrieved successfully",
        data=message,
    )


# -------------------------
# MARK MESSAGE AS READ (ADMIN / SELLER)
# -------------------------
@router.patch("/messages/{message_id}/read", response_model=SuccessResponse[ContactMessageDetailResponse])
def mark_message_read(
    message_id: UUID,
    current_staff: Annotated[User, Depends(get_current_staff_user)],
    contact_service: Annotated[ContactService, Depends(get_contact_service)],
):
    message = contact_service.mark_as_read(message_id, current_staff)

    return SuccessResponse(
        message="Message marked as read",
        data=message,
    )


# -------------------------
# REPLY TO MESSAGE (ADMIN / SELLER)
# -------------------------
@router.post("/messages/{message_id}/reply", response_model=SuccessResponse[ContactMessageDetailResponse])
def reply_to_message(
    message_id: UUID,
    payload: ContactReplyRequest,
    current_staff: Annotated[User, Depends(get_current_staff_user)],
    contact_service: Annotated[ContactService, Depends(get_contact_service)],
):
    message = contact_service.reply_to_message(message_id, current_staff, payload)

    return SuccessResponse(
        message="Reply sent successfully",
        data=message,
    )


# -------------------------
# SUBSCRIBE TO NEWSLETTER
# -------------------------
@router.post(
    "/newsletter/subscribe",
    response_model=NewsletterResponse,
    status_code=status.HTTP_201_CREATED,
)
def subscribe_newsletter(
    payload: NewsletterSubscribeRequest,
    contact_service: Annotated[ContactService, Depends(get_contact_service)],
):
    return contact_service.subscribe_newsletter(payload)
