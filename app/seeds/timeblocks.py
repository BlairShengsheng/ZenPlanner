from app.models import db, TimeBlock, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta

def seed_timeblocks():
    # Get today's date for base datetime
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    timeblock1 = TimeBlock(
        name='Morning Team Meeting',
        description='Daily standup with the development team',
        start_time=today.replace(hour=9, minute=0),  # 9:00 AM
        end_time=today.replace(hour=10, minute=0),   # 10:00 AM
        user_id=1
    )

    timeblock2 = TimeBlock(
        name='Project Planning',
        description='Quarterly planning session with stakeholders',
        start_time=today.replace(hour=11, minute=0),  # 11:00 AM
        end_time=today.replace(hour=12, minute=30),   # 12:30 PM
        user_id=2
    )

    timeblock3 = TimeBlock(
        name='Client Presentation',
        description='Present project progress to the client',
        start_time=today.replace(hour=14, minute=0),  # 2:00 PM
        end_time=today.replace(hour=15, minute=30),   # 3:30 PM
        user_id=3
    )

    # Add a time block for tomorrow
    tomorrow = today + timedelta(days=1)
    timeblock4 = TimeBlock(
        name='Code Review',
        description='Review pull requests and provide feedback',
        start_time=tomorrow.replace(hour=10, minute=0),  # 10:00 AM tomorrow
        end_time=tomorrow.replace(hour=11, minute=30),   # 11:30 AM tomorrow
        user_id=1
    )

    timeblock5 = TimeBlock(
        name='Sprint Retrospective',
        description='Team discussion about the last sprint',
        start_time=tomorrow.replace(hour=13, minute=0),  # 1:00 PM tomorrow
        end_time=tomorrow.replace(hour=14, minute=0),    # 2:00 PM tomorrow
        user_id=2
    )

    all_timeblocks = [timeblock1, timeblock2, timeblock3, timeblock4, timeblock5]
    db.session.add_all(all_timeblocks)
    db.session.commit()

def undo_timeblocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.timeblocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM timeblocks"))
        
    db.session.commit()
