"""add datetimes

Revision ID: 0a08360c9c58
Revises: e0e96cd41ed3
Create Date: 2022-04-02 16:42:18.728758

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0a08360c9c58'
down_revision = 'e0e96cd41ed3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bet_event', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date', sa.DateTime(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bet_event', schema=None) as batch_op:
        batch_op.drop_column('date')

    # ### end Alembic commands ###
