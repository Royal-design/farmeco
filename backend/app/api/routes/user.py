from uuid import UUID

from fastapi import APIRouter, Depends, File, Query, UploadFile

from app.api.dependencies.auth import get_current_admin_user, get_current_user
from app.api.dependencies.services import get_user_service
from app.core.exceptions import AppException
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.response import MessageResponse, SuccessResponse
from app.schemas.user import UserResponse, UserRoleUpdateRequest, UserUpdateRequest
from app.services.user_service import UserService

router = APIRouter()


# -------------------------
# GET MY PROFILE
# -------------------------
@router.get("/me", response_model=SuccessResponse[UserResponse])
def get_me(
    current_user: User = Depends(get_current_user),
):
    return SuccessResponse(
        message="Profile retrieved successfully",
        data=current_user,
    )


# -------------------------
# UPDATE MY PROFILE
# -------------------------
@router.put("/me", response_model=SuccessResponse[UserResponse])
def update_me(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    updated = user_service.update_user(current_user.id, payload)

    return SuccessResponse(
        message="Profile updated successfully",
        data=updated,
    )


# -------------------------
# UPDATE MY AVATAR
# -------------------------
@router.put("/me/avatar", response_model=SuccessResponse[UserResponse])
def update_avatar(
    avatar: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    updated = user_service.update_avatar(current_user.id, avatar)

    return SuccessResponse(
        message="Avatar updated successfully",
        data=updated,
    )


# -------------------------
# GET ALL USERS (ADMIN)
# -------------------------
@router.get(
    "",
    response_model=SuccessResponse[list[UserResponse]],
    dependencies=[Depends(get_current_admin_user)],
)
def get_users(
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    user_service: UserService = Depends(get_user_service),
):
    result = user_service.get_all_users(
        search=search,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Users retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# UPDATE USER ROLE (ADMIN)
# -------------------------
@router.patch(
    "/{user_id}/role",
    response_model=SuccessResponse[UserResponse],
    dependencies=[Depends(get_current_admin_user)],
)
def update_user_role(
    user_id: UUID,
    payload: UserRoleUpdateRequest,
    user_service: UserService = Depends(get_user_service),
):
    updated = user_service.update_user_role(user_id, payload.role)

    return SuccessResponse(
        message="User role updated successfully",
        data=updated,
    )


# -------------------------
# DELETE USER (SELF OR ADMIN)
# -------------------------
@router.delete("/{user_id}", response_model=MessageResponse)
def delete_user(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise AppException(
            message="You do not have permission to delete this account",
            status_code=403,
            error_code="FORBIDDEN",
        )

    user_service.delete_user(user_id)

    return MessageResponse(message="User deleted successfully")
