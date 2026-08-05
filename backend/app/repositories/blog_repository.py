from math import ceil
from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.blog_post import BlogPost


class BlogRepository:
    def __init__(self, db: Session):
        self.db = db

    def _query(self):
        return self.db.query(BlogPost)

    def get_all_posts(
        self,
        category: str | None = None,
        search: str | None = None,
        tag: str | None = None,
        page: int = 1,
        page_size: int = 10,
        published_only: bool = True,
    ) -> tuple[list[BlogPost], int]:
        query = self._query()

        if published_only:
            query = query.filter(BlogPost.published_at.isnot(None))

        if category and category != "all":
            query = query.filter(BlogPost.category == category)

        if search:
            like = f"%{search}%"
            query = query.filter(
                or_(
                    BlogPost.title.ilike(like),
                    BlogPost.excerpt.ilike(like),
                    BlogPost.tags.contains([search]),
                )
            )

        if tag:
            query = query.filter(BlogPost.tags.contains([tag]))

        total = query.count()

        offset = (page - 1) * page_size
        posts = (
            query
            .order_by(BlogPost.published_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        total_pages = ceil(total / page_size) if page_size else 0
        return posts, total, total_pages

    def get_post_by_id(self, post_id: UUID) -> BlogPost | None:
        return self._query().filter(BlogPost.id == post_id).first()

    def get_post_by_slug(self, slug: str) -> BlogPost | None:
        return self._query().filter(BlogPost.slug == slug).first()

    def get_featured_post(self) -> BlogPost | None:
        return (
            self._query()
            .filter(BlogPost.featured == True)
            .order_by(BlogPost.published_at.desc())
            .first()
        )

    def get_post_categories(self) -> list[str]:
        rows = self.db.query(BlogPost.category).distinct().all()
        return [row[0] for row in rows if row[0]]

    def create_post(self, post: BlogPost) -> BlogPost:
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        return post

    def update_post(self, post: BlogPost) -> BlogPost:
        self.db.commit()
        self.db.refresh(post)
        return post

    def delete_post(self, post: BlogPost) -> BlogPost:
        self.db.delete(post)
        self.db.commit()
        return post
