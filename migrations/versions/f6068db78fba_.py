"""empty message

Revision ID: f6068db78fba
Revises: 0f601b0993c7
Create Date: 2024-04-22 05:24:45.399196

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f6068db78fba'
down_revision = '0f601b0993c7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('restaurant', schema=None) as batch_op:
        batch_op.drop_column('hours')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('restaurant', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hours', sa.VARCHAR(), autoincrement=False, nullable=True))

    # ### end Alembic commands ###
