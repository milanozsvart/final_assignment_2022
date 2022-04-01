"""add results to db

Revision ID: a9a600b48bf4
Revises: 
Create Date: 2022-04-01 08:26:27.826875

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a9a600b48bf4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('match', sa.Column('result', sa.String(length=35), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('match', 'result')
    # ### end Alembic commands ###
