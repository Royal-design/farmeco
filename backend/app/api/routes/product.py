from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.services import get_product_service
from app.models.enums import ProductBadge
from app.models.user import User
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductSummaryResponse,
    ProductUpdate,
)
from app.schemas.response import MessageResponse, SuccessResponse
from app.services.product_service import ProductService

router = APIRouter()


# -------------------------
# GET ALL PRODUCTS
# -------------------------
@router.get("", response_model=SuccessResponse[list[ProductSummaryResponse]])
def get_products(
    category: str | None = Query(None),
    search: str | None = Query(None),
    sort: str = Query("popular"),
    min_price: float | None = Query(None, ge=0),
    max_price: float | None = Query(None, ge=0),
    rating: float | None = Query(None, ge=0, le=5),
    badge: ProductBadge | None = Query(None),
    in_stock: bool = Query(False),
    ids: list[UUID] | None = Query(None),
    seller_id: UUID | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    product_service: ProductService = Depends(get_product_service),
):
    result = product_service.get_all_products(
        category=category,
        search=search,
        sort=sort,
        min_price=min_price,
        max_price=max_price,
        rating=rating,
        badge=badge.value if badge else None,
        in_stock=in_stock,
        ids=ids,
        seller_id=seller_id,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Products retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# GET PRODUCT BY SLUG
# -------------------------
@router.get("/slug/{slug}", response_model=SuccessResponse[ProductResponse])
def get_product_by_slug(
    slug: str,
    product_service: ProductService = Depends(get_product_service),
):
    product = product_service.get_product_by_slug(slug)

    return SuccessResponse(
        message="Product retrieved successfully",
        data=product,
    )


# -------------------------
# GET RELATED PRODUCTS
# -------------------------
@router.get("/related/{product_id}", response_model=SuccessResponse[list[ProductSummaryResponse]])
def get_related_products(
    product_id: UUID,
    limit: int = Query(4, ge=1, le=12),
    product_service: ProductService = Depends(get_product_service),
):
    products = product_service.get_related_products(product_id, limit)

    return SuccessResponse(
        message="Related products retrieved successfully",
        data=products,
    )


# -------------------------
# GET PRODUCT BY ID
# -------------------------
@router.get("/{product_id}", response_model=SuccessResponse[ProductResponse])
def get_product_by_id(
    product_id: UUID,
    product_service: ProductService = Depends(get_product_service),
):
    product = product_service.get_product_by_id(product_id)

    return SuccessResponse(
        message="Product retrieved successfully",
        data=product,
    )


# -------------------------
# CREATE PRODUCT (SELLER / ADMIN)
# -------------------------
@router.post(
    "",
    response_model=SuccessResponse[ProductResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    payload: ProductCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    product_service: ProductService = Depends(get_product_service),
):
    product = product_service.create_product(payload, current_user)

    return SuccessResponse(
        message="Product created successfully",
        data=product,
    )


# -------------------------
# UPDATE PRODUCT
# -------------------------
@router.put("/{product_id}", response_model=SuccessResponse[ProductResponse])
def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    product_service: ProductService = Depends(get_product_service),
):
    product = product_service.update_product(product_id, current_user, payload)

    return SuccessResponse(
        message="Product updated successfully",
        data=product,
    )


# -------------------------
# DELETE PRODUCT
# -------------------------
@router.delete("/{product_id}", response_model=MessageResponse)
def delete_product(
    product_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    product_service: ProductService = Depends(get_product_service),
):
    product_service.delete_product(product_id, current_user)

    return MessageResponse(message="Product deleted successfully")
