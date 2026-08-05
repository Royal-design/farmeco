from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies.auth import get_current_admin_user, get_current_user
from app.api.dependencies.services import get_blog_service
from app.core.exceptions import AppException
from app.models.user import User
from app.schemas.blog import BlogPostCreate, BlogPostResponse, BlogPostUpdate
from app.schemas.response import MessageResponse, SuccessResponse
from app.services.blog_service import BlogService

router = APIRouter()


# -------------------------
# GET ALL POSTS
# -------------------------
@router.get("/", response_model=SuccessResponse[list[BlogPostResponse]])
def get_posts(
    category: str | None = Query(None),
    search: str | None = Query(None),
    tag: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    blog_service: BlogService = Depends(get_blog_service),
):
    result = blog_service.get_all_posts(
        category=category,
        search=search,
        tag=tag,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Posts retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# GET FEATURED POST
# -------------------------
@router.get("/featured", response_model=SuccessResponse[BlogPostResponse])
def get_featured_post(
    blog_service: BlogService = Depends(get_blog_service),
):
    post = blog_service.get_featured_post()

    if not post:
        raise AppException(
            message="No featured post found",
            status_code=404,
            error_code="POST_NOT_FOUND",
        )

    return SuccessResponse(
        message="Featured post retrieved successfully",
        data=post,
    )


# -------------------------
# GET POST CATEGORIES
# -------------------------
@router.get("/categories", response_model=SuccessResponse[list[str]])
def get_post_categories(
    blog_service: BlogService = Depends(get_blog_service),
):
    categories = blog_service.get_post_categories()

    return SuccessResponse(
        message="Post categories retrieved successfully",
        data=categories,
    )


# -------------------------
# GET POST BY SLUG
# -------------------------
@router.get("/slug/{slug}", response_model=SuccessResponse[BlogPostResponse])
def get_post_by_slug(
    slug: str,
    blog_service: BlogService = Depends(get_blog_service),
):
    post = blog_service.get_post_by_slug(slug)

    return SuccessResponse(
        message="Post retrieved successfully",
        data=post,
    )


# -------------------------
# CREATE POST (ADMIN)
# -------------------------
@router.post(
    "/",
    response_model=SuccessResponse[BlogPostResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin_user)],
)
def create_post(
    payload: BlogPostCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    blog_service: BlogService = Depends(get_blog_service),
):
    post = blog_service.create_post(payload, current_user)

    return SuccessResponse(
        message="Post created successfully",
        data=post,
    )


# -------------------------
# UPDATE POST (ADMIN)
# -------------------------
@router.put(
    "/{post_id}",
    response_model=SuccessResponse[BlogPostResponse],
    dependencies=[Depends(get_current_admin_user)],
)
def update_post(
    post_id: UUID,
    payload: BlogPostUpdate,
    blog_service: BlogService = Depends(get_blog_service),
):
    post = blog_service.update_post(post_id, payload)

    return SuccessResponse(
        message="Post updated successfully",
        data=post,
    )


# -------------------------
# DELETE POST (ADMIN)
# -------------------------
@router.delete(
    "/{post_id}",
    response_model=MessageResponse,
    dependencies=[Depends(get_current_admin_user)],
)
def delete_post(
    post_id: UUID,
    blog_service: BlogService = Depends(get_blog_service),
):
    blog_service.delete_post(post_id)

    return MessageResponse(message="Post deleted successfully")
