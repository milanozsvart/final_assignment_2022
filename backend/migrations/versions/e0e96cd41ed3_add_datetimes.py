"""add datetimes

Revision ID: e0e96cd41ed3
Revises: c22770a6adb6
Create Date: 2022-04-02 16:40:52.984270

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e0e96cd41ed3'
down_revision = 'c22770a6adb6'
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
