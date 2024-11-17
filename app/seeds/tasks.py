from app.models import db, Task, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_tasks():
    task1 = Task(
        name='Complete resume',
        description='Finish and submit the resume',
        priority='medium',
        user_id=1,
        created_at=date.today(),
        updated_at=date.today()
    )

    task2 = Task(
        name='Creating individual portfolio',
        description='Create online portfolio and release as soon as possible',
        priority='high',
        user_id=2,
        created_at=date.today(),
        updated_at=date.today()
    )

    task3 = Task(
        name='Polish Projects',
        description='Follow up with the previous projects and better it',
        priority='low',
        user_id=3,
        created_at=date.today(),
        updated_at=date.today()
    )

    all_tasks = [task1, task2, task3]
    db.session.add_all(all_tasks)
    db.session.commit()

def undo_tasks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tasks"))
        
    db.session.commit()
