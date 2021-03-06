"""change date from betevent to bet

Revision ID: 65bc222a8089
Revises: 4358ea27eb4e
Create Date: 2022-04-07 13:53:30.071562

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '65bc222a8089'
down_revision = '4358ea27eb4e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bet', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date', sa.DateTime(), nullable=True))

    with op.batch_alter_table('bet_event', schema=None) as batch_op:
        batch_op.drop_column('date')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bet_event', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date', sa.DATETIME(), nullable=True))

    with op.batch_alter_table('bet', schema=None) as batch_op:
        batch_op.drop_column('date')

    # ### end Alembic commands ###
