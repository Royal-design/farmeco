"""payments and notifications

Revision ID: f2a9b8c7d6e5
Revises: e5b7c8d9a0f1
Create Date: 2026-08-06 13:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f2a9b8c7d6e5'
down_revision: Union[str, Sequence[str], None] = 'e5b7c8d9a0f1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE paymentstatus AS ENUM ('UNPAID', 'PAID', 'FAILED', 'REFUNDED');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE notificationtype AS ENUM ('MESSAGE', 'ORDER', 'PAYMENT', 'SYSTEM');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    """)

    op.add_column('orders', sa.Column('payment_status', postgresql.ENUM(name='paymentstatus', create_type=False), nullable=True))
    op.add_column('orders', sa.Column('payment_reference', sa.String(), nullable=True))
    op.add_column('orders', sa.Column('paid_at', sa.DateTime(), nullable=True))
    op.execute("UPDATE orders SET payment_status = 'UNPAID' WHERE payment_status IS NULL")
    op.alter_column('orders', 'payment_status', nullable=False)

    op.create_table(
        'notifications',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('type', postgresql.ENUM(name='notificationtype', create_type=False), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('body', sa.Text(), nullable=True),
        sa.Column('link', sa.String(), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('notifications')
    op.drop_column('orders', 'paid_at')
    op.drop_column('orders', 'payment_reference')
    op.drop_column('orders', 'payment_status')
    op.execute("DROP TYPE IF EXISTS notificationtype")
    op.execute("DROP TYPE IF EXISTS paymentstatus")
