from uuid import UUID

from fastapi import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.api.dependencies.services import get_user_service
from app.core.exceptions import AppException
from app.core.security import decode_access_token
from app.models.enums import UserRole
from app.models.user import User
from app.services.user_service import UserService

bearer_scheme = HTTPBearer()
optional_bearer_scheme = HTTPBearer(auto_error=False)


def get_bearer_token(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
) -> str:
    return credentials.credentials


def get_current_user(
    token: str = Depends(get_bearer_token),
    user_service: UserService = Depends(get_user_service),
) -> User:
    payload = decode_access_token(token)

    try:
        user_id = UUID(payload.get("sub"))
    except (AttributeError, TypeError, ValueError):
        raise AppException(
            message="Invalid token subject",
            status_code=401,
            error_code="INVALID_TOKEN",
        )

    user = user_service.get_user_by_id(user_id)

    if not user:
        raise AppException(
            message="User not found",
            status_code=404,
            error_code="USER_NOT_FOUND",
        )

    if not user.is_active:
        raise AppException(
            message="This account has been deactivated",
            status_code=403,
            error_code="ACCOUNT_DEACTIVATED",
        )

    return user


def get_current_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise AppException(
            message="Admin privileges required",
            status_code=403,
            error_code="FORBIDDEN",
        )
    return current_user


def get_current_staff_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role not in (UserRole.ADMIN, UserRole.SELLER):
        raise AppException(
            message="Admin or seller privileges required",
            status_code=403,
            error_code="FORBIDDEN",
        )
    return current_user


def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Security(optional_bearer_scheme),
    user_service: UserService = Depends(get_user_service),
) -> User | None:
    if credentials is None:
        return None

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = UUID(payload.get("sub"))
    except (AttributeError, TypeError, ValueError):
        return None

    user = user_service.get_user_by_id(user_id)

    if not user or not user.is_active:
        return None

    return user
