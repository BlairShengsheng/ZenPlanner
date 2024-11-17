from flask.cli import AppGroup
from .users import seed_users, undo_users

# add other import here
from .tasks import seed_tasks, undo_tasks
from .habits import seed_habits, undo_habits
from .timeblocks import seed_timeblocks, undo_timeblocks

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_tasks()
        undo_habits()
        undo_timeblocks()
    seed_users()
    # Add other seed functions here
    seed_tasks()
    seed_habits()
    seed_timeblocks()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    # Add other undo functions here
    undo_tasks()
    undo_habits()
    undo_timeblocks()
