"""add betname

Revision ID: 3cb62343082e
Revises: a7160264032a
Create Date: 2022-04-11 12:32:49.384572

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3cb62343082e'
down_revision = 'a7160264032a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bet', schema=None) as batch_op:
        batch_op.add_column(sa.Column('betName', sa.String(length=50), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bet', schema=None) as batch_op:
        batch_op.drop_column('betName')

    # ### end Alembic commands ###
