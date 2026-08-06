"""shipping settings

Revision ID: c4d5e6f7a8b9
Revises: f2a9b8c7d6e5
Create Date: 2026-08-06 14:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c4d5e6f7a8b9'
down_revision: Union[str, Sequence[str], None] = 'f2a9b8c7d6e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'shipping_settings',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('free_shipping_threshold', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('flat_rate', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.execute(
        "INSERT INTO shipping_settings (id, free_shipping_threshold, flat_rate, updated_at) "
        "VALUES (gen_random_uuid(), 200000, 15000, now())"
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('shipping_settings')
