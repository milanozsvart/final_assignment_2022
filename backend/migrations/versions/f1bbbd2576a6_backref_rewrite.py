"""backref rewrite

Revision ID: f1bbbd2576a6
Revises: 5cd9912a1fd4
Create Date: 2022-04-02 15:06:40.303559

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f1bbbd2576a6'
down_revision = '5cd9912a1fd4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bet', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(None, 'user', ['user'], ['id'])
        batch_op.drop_column('bettedOn')
        batch_op.drop_column('matchId')

    with op.batch_alter_table('bet_event', schema=None) as batch_op:
        batch_op.alter_column('matchId',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(None, 'bet', ['betId'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bet_event', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(None, 'bet_event', ['betId'], ['id'])
        batch_op.alter_column('matchId',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('bet', schema=None) as batch_op:
        batch_op.add_column(sa.Column('matchId', sa.INTEGER(), nullable=False))
        batch_op.add_column(sa.Column('bettedOn', sa.VARCHAR(length=35), nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(None, 'match', ['matchId'], ['id'])

    # ### end Alembic commands ###
