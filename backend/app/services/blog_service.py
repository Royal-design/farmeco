import math
from uuid import UUID

from slugify import slugify

from app.core.exceptions import AppException
from app.models.blog_post import BlogPost
from app.models.user import User
from app.repositories.blog_repository import BlogRepository
from app.schemas.blog import BlogPostCreate, BlogPostUpdate
from app.schemas.user import PaginationMeta


class BlogService:
    def __init__(self, repository: BlogRepository):
        self.repository = repository

    # -------------------------
    # GET ALL POSTS
    # -------------------------
    def get_all_posts(
        self,
        category: str | None = None,
        search: str | None = None,
        tag: str | None = None,
        page: int = 1,
        page_size: int = 10,
    ):
        posts, total, total_pages = self.repository.get_all_posts(
            category=category,
            search=search,
            tag=tag,
            page=page,
            page_size=page_size,
        )

        return {
            "data": posts,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ).model_dump(),
        }

    # -------------------------
    # GET POST BY ID
    # -------------------------
    def get_post_by_id(self, post_id: UUID) -> BlogPost:
        post = self.repository.get_post_by_id(post_id)

        if not post:
            raise AppException(
                message="Post not found",
                status_code=404,
                error_code="POST_NOT_FOUND",
            )

        return post

    # -------------------------
    # GET POST BY SLUG
    # -------------------------
    def get_post_by_slug(self, slug: str) -> BlogPost:
        post = self.repository.get_post_by_slug(slug)

        if not post:
            raise AppException(
                message="Post not found",
                status_code=404,
                error_code="POST_NOT_FOUND",
            )

        return post

    # -------------------------
    # GET FEATURED POST
    # -------------------------
    def get_featured_post(self) -> BlogPost | None:
        return self.repository.get_featured_post()

    # -------------------------
    # GET POST CATEGORIES
    # -------------------------
    def get_post_categories(self) -> list[str]:
        return self.repository.get_post_categories()

    # -------------------------
    # CREATE POST
    # -------------------------
    def create_post(self, post: BlogPostCreate, current_user: User) -> BlogPost:
        db_post = BlogPost(
            **post.model_dump(),
            slug=self._generate_unique_slug(post.title),
            read_time=self._estimate_read_time(post.content),
            author_id=current_user.id,
            author_name=current_user.name,
            author_role=current_user.role.value,
            author_avatar=current_user.avatar,
        )

        return self.repository.create_post(db_post)

    # -------------------------
    # UPDATE POST
    # -------------------------
    def update_post(self, post_id: UUID, post: BlogPostUpdate) -> BlogPost:
        db_post = self.get_post_by_id(post_id)

        updates = post.model_dump(exclude_unset=True)

        if "title" in updates and updates["title"] != db_post.title:
            updates["slug"] = self._generate_unique_slug(updates["title"])

        if "content" in updates and updates["content"] is not None:
            updates["read_time"] = self._estimate_read_time(updates["content"])

        for key, value in updates.items():
            setattr(db_post, key, value)

        return self.repository.update_post(db_post)

    # -------------------------
    # DELETE POST
    # -------------------------
    def delete_post(self, post_id: UUID) -> BlogPost:
        db_post = self.get_post_by_id(post_id)
        return self.repository.delete_post(db_post)

    # -------------------------
    # HELPERS
    # -------------------------
    def _generate_unique_slug(self, title: str) -> str:
        base_slug = slugify(title)
        slug = base_slug
        counter = 1

        while self.repository.get_post_by_slug(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug

    @staticmethod
    def _estimate_read_time(content: list[str]) -> int:
        words = len(" ".join(content).split())
        return max(1, math.ceil(words / 200))
