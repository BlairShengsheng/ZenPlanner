from app.models import db, Habit, environment, SCHEMA
from sqlalchemy.sql import text

def seed_habits():
  habit1 = Habit(
    name = 'Exercise',
    description = 'run for 30 minutes',
    user_id = 1
  )
  habit2 = Habit(
    name = 'Reading',
    description = 'read that book at least 50 pages',
    user_id = 2
  )
  habit3 = Habit(
    name = 'Meditation',
    description = 'meditate for one hour',
    user_id = 3
  )

  all_habits = [habit1, habit2, habit3]

  db.session.add_all(all_habits)
  db.session.commit()

def undo_habits():
    if environment == "production":
      db.session.execute(f"TRUNCATE table {SCHEMA}.habits RESTART IDENTITY CASCADE;")
    else:
      db.session.execute(text("DELETE FROM habits"))
        
    db.session.commit()
