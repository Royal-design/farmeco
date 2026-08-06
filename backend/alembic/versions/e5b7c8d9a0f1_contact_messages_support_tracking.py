"""contact messages support + tracking

Revision ID: e5b7c8d9a0f1
Revises: c8f3a1e9b2d4
Create Date: 2026-08-06 12:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e5b7c8d9a0f1'
down_revision: Union[str, Sequence[str], None] = 'c8f3a1e9b2d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    contactstatus = postgresql.ENUM('NEW', 'READ', 'REPLIED', name='contactstatus')
    contactstatus.create(op.get_bind(), checkfirst=True)

    op.add_column('contact_messages', sa.Column('user_id', sa.UUID(), nullable=True))
    op.add_column('contact_messages', sa.Column('status', contactstatus, nullable=True))
    op.add_column('contact_messages', sa.Column('read_at', sa.DateTime(), nullable=True))
    op.add_column('contact_messages', sa.Column('user_read_at', sa.DateTime(), nullable=True))
    op.add_column('contact_messages', sa.Column('admin_reply', sa.Text(), nullable=True))
    op.add_column('contact_messages', sa.Column('replied_at', sa.DateTime(), nullable=True))
    op.add_column('contact_messages', sa.Column('replied_by', sa.UUID(), nullable=True))
    op.add_column(
        'contact_messages',
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )
    op.create_foreign_key('fk_contact_messages_user_id', 'contact_messages', 'users', ['user_id'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_contact_messages_replied_by', 'contact_messages', 'users', ['replied_by'], ['id'], ondelete='SET NULL')
    op.execute("UPDATE contact_messages SET status = 'NEW' WHERE status IS NULL")
    op.execute("UPDATE contact_messages SET updated_at = created_at WHERE updated_at IS NULL")
    op.alter_column('contact_messages', 'status', nullable=False)
    op.alter_column('contact_messages', 'updated_at', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('fk_contact_messages_replied_by', 'contact_messages', type_='foreignkey')
    op.drop_constraint('fk_contact_messages_user_id', 'contact_messages', type_='foreignkey')
    op.drop_column('contact_messages', 'updated_at')
    op.drop_column('contact_messages', 'replied_by')
    op.drop_column('contact_messages', 'replied_at')
    op.drop_column('contact_messages', 'admin_reply')
    op.drop_column('contact_messages', 'user_read_at')
    op.drop_column('contact_messages', 'read_at')
    op.drop_column('contact_messages', 'status')
    op.drop_column('contact_messages', 'user_id')
    contactstatus = postgresql.ENUM('NEW', 'READ', 'REPLIED', name='contactstatus')
    contactstatus.drop(op.get_bind(), checkfirst=True)
