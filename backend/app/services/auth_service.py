from datetime import datetime, timezone
from uuid import UUID, uuid4

import requests
from fastapi import BackgroundTasks, Request

from app.core.config import settings
from app.core.exceptions import AppException
from app.core.security import (
    create_access_token,
    create_password_reset_token,
    create_refresh_token,
    decode_password_reset_token,
    decode_refresh_token,
    get_token_jti,
    hash_password,
    revoke_token,
    verify_password,
)
from app.models.enums import AuthProvider
from app.models.user import DEFAULT_PREFERENCES, User
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    GoogleAuthRequest,
    ResetPasswordRequest,
)
from app.schemas.response import MessageResponse
from app.schemas.user import (
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
)
from app.services.email_service import EmailService
from app.services.refresh_token_service import RefreshTokenService
from app.services.user_service import UserService


class AuthService:
    def __init__(
        self,
        user_service: UserService,
        email_service: EmailService,
        refresh_token_service: RefreshTokenService,
    ):
        self.user_service = user_service
        self.email_service = email_service
        self.refresh_token_service = refresh_token_service

    # -------------------------
    # REGISTER
    # -------------------------
    def register(
        self,
        user: RegisterRequest,
        background_tasks: BackgroundTasks,
    ):
        hashed_password = hash_password(user.password)

        db_user = self.user_service.create_user(user, hashed_password)

        background_tasks.add_task(
            self.email_service.send_welcome_email,
            db_user.email,
            db_user.name,
        )

        return self._build_auth_payload(db_user)

    # -------------------------
    # LOGIN
    # -------------------------
    def login(self, login_data: LoginRequest, request: Request | None = None):
        user = self.user_service.get_user_by_email(login_data.email)

        if not user or not verify_password(login_data.password, user.password):
            raise AppException(
                message="Invalid email or password",
                status_code=401,
                error_code="INVALID_CREDENTIALS",
            )

        if not user.is_active:
            raise AppException(
                message="This account has been deactivated",
                status_code=403,
                error_code="ACCOUNT_DEACTIVATED",
            )

        return self._build_auth_payload(user, request)

    # -------------------------
    # GOOGLE LOGIN
    # -------------------------
    def google_login(self, request: GoogleAuthRequest):
        token_resp = requests.get(
            f"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={request.access_token}",
            timeout=10,
        )

        if token_resp.status_code != 200:
            raise AppException(
                message="Invalid Google token",
                status_code=401,
                error_code="INVALID_GOOGLE_TOKEN",
            )

        token_data = token_resp.json()
        if token_data.get("aud") != settings.google_client_id:
            raise AppException(
                message="Invalid Google token audience",
                status_code=401,
                error_code="INVALID_GOOGLE_TOKEN",
            )

        profile_resp = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {request.access_token}"},
            timeout=10,
        )

        if profile_resp.status_code != 200:
            raise AppException(
                message="Invalid Google token",
                status_code=401,
                error_code="INVALID_GOOGLE_TOKEN",
            )

        data = profile_resp.json()

        email = data.get("email")
        if not email:
            raise AppException(
                message="Google account has no email",
                status_code=400,
                error_code="GOOGLE_NO_EMAIL",
            )

        first_name = data.get("given_name", "")
        last_name = data.get("family_name", "")
        avatar = data.get("picture")

        name = f"{first_name} {last_name}".strip() or email.split("@")[0]

        user = self.user_service.get_user_by_email(email)

        if user:
            if user.provider != AuthProvider.GOOGLE:
                user.provider = AuthProvider.GOOGLE
                user.avatar = avatar or user.avatar
                user.is_verified = True
                self.user_service.save_user(user)
        else:
            db_user = User(
                name=name,
                email=email,
                password=hash_password(str(uuid4())),
                avatar=avatar,
                provider=AuthProvider.GOOGLE,
                is_verified=True,
                preferences=DEFAULT_PREFERENCES.copy(),
            )
            user = self.user_service.repository.create_user(db_user)

        return self._build_auth_payload(user)

    # -------------------------
    # REFRESH TOKEN
    # -------------------------
    def refresh(
        self,
        refresh_data: RefreshTokenRequest,
        request: Request | None = None,
    ):
        payload = decode_refresh_token(refresh_data.refresh_token)

        token_jti = payload.get("jti")
        if not token_jti:
            raise AppException(
                message="Invalid refresh token",
                status_code=401,
                error_code="INVALID_REFRESH_TOKEN",
            )

        self.refresh_token_service.validate_refresh_token(token_jti)

        try:
            user_id = UUID(payload["sub"])
        except (KeyError, TypeError, ValueError):
            raise AppException(
                message="Invalid token subject",
                status_code=401,
                error_code="INVALID_TOKEN",
            )

        user = self.user_service.get_user_by_id(user_id)

        self.refresh_token_service.revoke_refresh_token(token_jti)
        revoke_token(refresh_data.refresh_token)

        return self._build_auth_payload(user, request)

    # -------------------------
    # LOGOUT
    # -------------------------
    def logout(
        self,
        access_token: str,
        refresh_token: str | None = None,
    ):
        revoke_token(access_token)

        if refresh_token:
            try:
                token_jti = get_token_jti(refresh_token)
            except AppException:
                token_jti = None

            if token_jti:
                self.refresh_token_service.revoke_refresh_token(token_jti)

            try:
                revoke_token(refresh_token)
            except AppException:
                pass

        return MessageResponse(message="Successfully logged out")

    # -------------------------
    # FORGOT PASSWORD
    # -------------------------
    def forgot_password(
        self,
        request: ForgotPasswordRequest,
        background_tasks: BackgroundTasks,
    ):
        user = self.user_service.get_user_by_email(request.email)

        response = MessageResponse(
            message=(
                "If an account exists with this email, "
                "a reset link has been sent."
            )
        )

        if not user:
            return response

        reset_token = create_password_reset_token({"sub": str(user.id)})

        reset_link = (
            f"{settings.frontend_url}/reset-password?token={reset_token}"
        )

        background_tasks.add_task(
            self.email_service.send_password_reset_email,
            user.email,
            reset_link,
        )

        return response

    # -------------------------
    # RESET PASSWORD
    # -------------------------
    def reset_password(self, request: ResetPasswordRequest):
        payload = decode_password_reset_token(request.token)

        try:
            user_id = UUID(payload["sub"])
        except (KeyError, TypeError, ValueError):
            raise AppException(
                message="Invalid reset token",
                status_code=401,
                error_code="INVALID_RESET_TOKEN",
            )

        user = self.user_service.get_user_by_id(user_id)

        user.password = hash_password(request.new_password)

        self.user_service.save_user(user)

        revoke_token(request.token)

        return MessageResponse(message="Password reset successfully")

    # -------------------------
    # CHANGE PASSWORD
    # -------------------------
    def change_password(
        self,
        user_id: UUID,
        request: ChangePasswordRequest,
    ):
        user = self.user_service.get_user_by_id(user_id)

        if not verify_password(request.current_password, user.password):
            raise AppException(
                message="Current password is incorrect",
                status_code=401,
                error_code="INVALID_PASSWORD",
            )

        user.password = hash_password(request.new_password)

        self.user_service.save_user(user)

        return MessageResponse(message="Password changed successfully")

    # -------------------------
    # HELPERS
    # -------------------------
    def _build_auth_payload(self, user: User, request: Request | None = None):
        payload = {
            "sub": str(user.id),
            "email": user.email,
        }

        refresh_token = create_refresh_token(payload)
        refresh_payload = decode_refresh_token(refresh_token)
        expires_at = datetime.fromtimestamp(
            refresh_payload["exp"],
            tz=timezone.utc,
        )

        user_agent = None
        ip_address = None
        if request:
            user_agent = request.headers.get("user-agent")
            forwarded = request.headers.get("x-forwarded-for")
            if forwarded:
                ip_address = forwarded.split(",")[0].strip()
            else:
                ip_address = request.client.host if request.client else None

        self.refresh_token_service.store_refresh_token(
            token_jti=refresh_payload["jti"],
            user_id=user.id,
            expires_at=expires_at,
            user_agent=user_agent,
            ip_address=ip_address,
        )

        return {
            "user": user,
            "access_token": create_access_token(payload),
            "refresh_token": refresh_token,
        }
