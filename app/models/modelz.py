from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, date
from sqlalchemy.orm import validates
from .user import User



class Task(db.Model):
  __tablename__ = 'tasks'

  if environment == "production":
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100), nullable=False)
  description = db.Column(db.Text, nullable=False)
  priority = db.Column(db.String(10), default='low')

  # created_at = db.Column(db.DateTime, default=lambda: datetime.now())
  # updated_at = db.Column(db.DateTime, default=lambda: datetime.now(), onupdate=lambda:datetime.now())

  created_at = db.Column(db.Date, default=lambda: date.today())
  updated_at = db.Column(db.Date, default=lambda: date.today(), onupdate=lambda: date.today())

  user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

  # Add relationship
  user = db.relationship('User', back_populates='tasks')

  def __repr__(self):
    return f"<Task(id={self.id}, name={self.name})>"
  
  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'description': self.description,
      'priority': self.priority,
      'created_at': self.created_at.strftime('%m/%d/%Y') if self.created_at else None,  
      'updated_at': self.updated_at.strftime('%m/%d/%Y') if self.updated_at else None,  
      'user_id': self.user_id,
      'user': self.user.to_dict()
    }


class Habit(db.Model):
  __tablename__ = 'habits'

  if environment == "production":
    __table_args__ = {'schema':SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100), unique=True, nullable=False)
  description = db.Column(db.Text, nullable=False)

  user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

  # Add relationship
  user = db.relationship('User', back_populates='habits')

  def __repr__(self):
    return f"<Habit(id={self.id},name={self.name})>"
  
  def to_dict(self):
    return {
      'id': self.id,
      'name':self.name,
      'description':self.description,
      'user_id': self.user_id,
      'user':self.user.to_dict()
    }


class TimeBlock(db.Model):
  __tablename__ = 'timeblocks'

  if environment == "production":
    __table_args__ = {'schema':SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100), nullable=False)
  description = db.Column(db.Text, nullable=False)
  start_time = db.Column(db.DateTime, nullable=False)
  end_time = db.Column(db.DateTime, nullable=False)

  user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

  # Add relationship
  user = db.relationship('User', back_populates='timeblocks')

  def __repr__(self):
    return f"<TimeBlock(id={self.id}, name={self.name})>"
  
  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'description': self.description,
      'start_time': self.start_time.strftime('%Y-%m-%d %H:%M:%S') if self.start_time else None,
      'end_time': self.end_time.strftime('%Y-%m-%d %H:%M:%S') if self.end_time else None,
      'created_at': self.created_at.strftime('%m/%d/%Y') if self.created_at else None,
      'updated_at': self.updated_at.strftime('%m/%d/%Y') if self.updated_at else None,
      'user_id': self.user_id,
      'user': self.user.to_dict()
    }
  

  @property
  def duration(self):
      """Calculate the duration of the time block in minutes"""
      if self.start_time and self.end_time:
          return int((self.end_time - self.start_time).total_seconds() / 60)
      return None

  def is_overlapping(self, other_timeblock):
      """Check if this time block overlaps with another"""
      return (self.start_time < other_timeblock.end_time and 
                self.end_time > other_timeblock.start_time)

  @validates('start_time', 'end_time')
  def validate_times(self, key, value):
      """Validate start_time and end_time"""
      if key == 'end_time' and self.start_time and value:
          if value <= self.start_time:
              raise ValueError("End time must be after start time")
      return value
