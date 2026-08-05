import math
from uuid import UUID

from fastapi import UploadFile

from app.core.exceptions import AppException
from app.models.enums import UserRole
from app.models.user import DEFAULT_PREFERENCES, User
from app.repositories.user_repository import UserRepository
from app.schemas.user import PaginationMeta, RegisterRequest, UserUpdateRequest
from app.services.cloudinary_service import CloudinaryService


class UserService:
    def __init__(self, repository: UserRepository, cloudinary: CloudinaryService):
        self.repository = repository
        self.cloudinary = cloudinary

    # -------------------------
    # GET ALL USERS (ADMIN)
    # -------------------------
    def get_all_users(
        self,
        search: str | None = None,
        page: int = 1,
        page_size: int = 10,
    ):
        users, total = self.repository.get_user_all(
            search=search,
            page=page,
            page_size=page_size,
        )

        total_pages = math.ceil(total / page_size) if page_size else 0

        return {
            "data": users,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ).model_dump(),
        }

    # -------------------------
    # GET USER BY ID
    # -------------------------
    def get_user_by_id(self, user_id: UUID) -> User:
        user = self.repository.get_user_by_id(user_id)

        if not user:
            raise AppException(
                message="User not found",
                status_code=404,
                error_code="USER_NOT_FOUND",
            )

        return user

    # -------------------------
    # GET USER BY EMAIL
    # -------------------------
    def get_user_by_email(self, email: str) -> User | None:
        return self.repository.get_user_by_email(email)

    # -------------------------
    # CREATE USER
    # -------------------------
    def create_user(self, user: RegisterRequest, hashed_password: str) -> User:
        if self.get_user_by_email(user.email):
            raise AppException(
                message="Email already exists",
                status_code=409,
                error_code="EMAIL_ALREADY_EXISTS",
            )

        db_user = User(
            name=user.name,
            email=user.email,
            phone=user.phone,
            password=hashed_password,
            preferences=DEFAULT_PREFERENCES.copy(),
        )

        return self.repository.create_user(db_user)

    # -------------------------
    # UPDATE USER
    # -------------------------
    def update_user(self, user_id: UUID, user: UserUpdateRequest) -> User:
        db_user = self.get_user_by_id(user_id)

        updates = user.model_dump(exclude_unset=True)

        if "email" in updates:
            existing_user = self.get_user_by_email(updates["email"])
            if existing_user and existing_user.id != user_id:
                raise AppException(
                    message="Email already exists",
                    status_code=409,
                    error_code="EMAIL_ALREADY_EXISTS",
                )

        if "address" in updates and updates["address"] is not None:
            updates["address"] = {
                **(db_user.address or {}),
                **updates["address"],
            }

        if "preferences" in updates and updates["preferences"] is not None:
            updates["preferences"] = {
                **(db_user.preferences or DEFAULT_PREFERENCES.copy()),
                **updates["preferences"],
            }

        for key, value in updates.items():
            setattr(db_user, key, value)

        return self.repository.update_user(db_user)

    # -------------------------
    # UPDATE AVATAR
    # -------------------------
    def update_avatar(self, user_id: UUID, avatar: UploadFile) -> User:
        user = self.get_user_by_id(user_id)

        if user.avatar_public_id:
            self.cloudinary.delete_image(user.avatar_public_id)

        image = self.cloudinary.upload_image(avatar, folder="farmeco/profiles")

        user.avatar = image["url"]
        user.avatar_public_id = image["public_id"]

        return self.repository.update_user(user)

    # -------------------------
    # UPDATE USER ROLE (ADMIN ONLY)
    # -------------------------
    def update_user_role(self, user_id: UUID, role: UserRole) -> User:
        db_user = self.get_user_by_id(user_id)
        db_user.role = role
        return self.repository.update_user(db_user)

    # -------------------------
    # SAVE USER (for auth service)
    # -------------------------
    def save_user(self, user: User) -> User:
        return self.repository.update_user(user)

    # -------------------------
    # DELETE USER
    # -------------------------
    def delete_user(self, user_id: UUID) -> User:
        user = self.get_user_by_id(user_id)
        return self.repository.delete_user(user)
