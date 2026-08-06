"""add audit_logs and order status history

Revision ID: c8f3a1e9b2d4
Revises: b00e2dc237e2
Create Date: 2026-08-06 11:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c8f3a1e9b2d4'
down_revision: Union[str, Sequence[str], None] = 'b00e2dc237e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('audit_logs',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('actor_id', sa.UUID(), nullable=True),
    sa.Column('actor_email', sa.String(), nullable=True),
    sa.Column('actor_name', sa.String(), nullable=True),
    sa.Column('action', sa.String(), nullable=False),
    sa.Column('resource_type', sa.String(), nullable=False),
    sa.Column('resource_id', sa.String(), nullable=True),
    sa.Column('summary', sa.String(), nullable=False),
    sa.Column('before_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.Column('after_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.Column('ip_address', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['actor_id'], ['users.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column(
        'orders',
        sa.Column('status_history', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.execute(
        "UPDATE orders "
        "SET status_history = jsonb_build_array("
        "jsonb_build_object('status', lower(status::text), 'at', created_at)"
        ") "
        "WHERE status_history IS NULL OR jsonb_array_length(status_history) = 0"
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('orders', 'status_history')
    op.drop_table('audit_logs')
