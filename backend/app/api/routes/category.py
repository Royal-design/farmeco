from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies.auth import get_current_admin_user
from app.api.dependencies.services import get_category_service
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.schemas.response import MessageResponse, SuccessResponse
from app.services.category_service import CategoryService

router = APIRouter()


# -------------------------
# GET ALL CATEGORIES
# -------------------------
@router.get("", response_model=SuccessResponse[list[CategoryResponse]])
def get_categories(
    featured: bool | None = Query(None),
    search: str | None = Query(None),
    sort: str = Query("featured"),
    category_service: CategoryService = Depends(get_category_service),
):
    categories = category_service.get_all_categories(
        featured=featured,
        search=search,
        sort=sort,
    )

    return SuccessResponse(
        message="Categories retrieved successfully",
        data=categories,
    )


# -------------------------
# GET FEATURED CATEGORIES
# -------------------------
@router.get("/featured", response_model=SuccessResponse[list[CategoryResponse]])
def get_featured_categories(
    category_service: CategoryService = Depends(get_category_service),
):
    categories = category_service.get_featured_categories()

    return SuccessResponse(
        message="Featured categories retrieved successfully",
        data=categories,
    )


# -------------------------
# GET CATEGORY BY SLUG
# -------------------------
@router.get("/slug/{slug}", response_model=SuccessResponse[CategoryResponse])
def get_category_by_slug(
    slug: str,
    category_service: CategoryService = Depends(get_category_service),
):
    category = category_service.get_category_by_slug(slug)

    return SuccessResponse(
        message="Category retrieved successfully",
        data=category,
    )


# -------------------------
# GET CATEGORY BY ID
# -------------------------
@router.get("/{category_id}", response_model=SuccessResponse[CategoryResponse])
def get_category_by_id(
    category_id: UUID,
    category_service: CategoryService = Depends(get_category_service),
):
    category = category_service.get_category_by_id(category_id)

    return SuccessResponse(
        message="Category retrieved successfully",
        data=category,
    )


# -------------------------
# CREATE CATEGORY (ADMIN)
# -------------------------
@router.post(
    "",
    response_model=SuccessResponse[CategoryResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    payload: CategoryCreate,
    current_admin: User = Depends(get_current_admin_user),
    category_service: CategoryService = Depends(get_category_service),
):
    category = category_service.create_category(payload, current_admin)

    return SuccessResponse(
        message="Category created successfully",
        data=category,
    )


# -------------------------
# UPDATE CATEGORY (ADMIN)
# -------------------------
@router.put(
    "/{category_id}",
    response_model=SuccessResponse[CategoryResponse],
)
def update_category(
    category_id: UUID,
    payload: CategoryUpdate,
    current_admin: User = Depends(get_current_admin_user),
    category_service: CategoryService = Depends(get_category_service),
):
    category = category_service.update_category(category_id, payload, current_admin)

    return SuccessResponse(
        message="Category updated successfully",
        data=category,
    )


# -------------------------
# DELETE CATEGORY (ADMIN)
# -------------------------
@router.delete(
    "/{category_id}",
    response_model=MessageResponse,
)
def delete_category(
    category_id: UUID,
    current_admin: User = Depends(get_current_admin_user),
    category_service: CategoryService = Depends(get_category_service),
):
    category_service.delete_category(category_id, current_admin)

    return MessageResponse(message="Category deleted successfully")
