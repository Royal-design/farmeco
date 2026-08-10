"""blog post image gallery

Revision ID: d1e2f3a4b5c6
Revises: c4d5e6f7a8b9
Create Date: 2026-08-10 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd1e2f3a4b5c6'
down_revision: Union[str, Sequence[str], None] = 'c4d5e6f7a8b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'blog_posts',
        sa.Column('images', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.execute(
        "UPDATE blog_posts SET images = CASE "
        "WHEN cover_image IS NOT NULL AND cover_image <> '' THEN jsonb_build_array(cover_image) "
        "ELSE '[]'::jsonb END"
    )
    op.alter_column('blog_posts', 'images', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('blog_posts', 'images')
