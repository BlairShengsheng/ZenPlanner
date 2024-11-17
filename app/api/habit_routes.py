# app/habit_routes.py

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Habit

habit_routes = Blueprint('habits', __name__)

# GET /api/habits - Get all habits
@habit_routes.route('/', methods=['GET'])
@login_required
def get_habits():
  habits = Habit.query.filter_by(user_id = current_user.id).all()
  return jsonify([habit.to_dict() for habit in habits])



# POST /api/habits - Create new habit
@habit_routes.route('/', methods=['POST'])
@login_required
def create_habit():
  data = request.get_json()

  if not current_user.is_authenticated:
    return jsonify({"error": {"message":"Unauthorized"}}), 401
  
  habit = Habit(
    user_id = current_user.id,
    name = data['name'],
    # Default to empty string if not provided
    description = data.get('description','')
  )

  db.session.add(habit)
  db.session.commit()

  return jsonify(habit.to_dict()), 201


# GET/api/habits/<id> - Get specific habit
@habit_routes.route('/<int:habit_id>', methods=['GET'])
@login_required
def get_the_habit(habit_id):
  
  habit = Habit.query.filter_by(
    id = habit_id,
    user_id = current_user.id
  ).first_or_404()

  return jsonify(habit.to_dict())

# PUT /api/habits/<id> - Update habit
@habit_routes.route('/<int:habit_id>', methods=['PUT'])
@login_required
def update_habit(habit_id):

  habit = Habit.query.filter_by(
    id = habit_id,
    user_id = current_user.id
  ).first_or_404()

  data = request.get_json()

  habit.name = data.get('name',habit.name)
  habit.description = data.get('description', habit.description)

  db.session.commit()
  return jsonify(habit.to_dict())

# DELETE /api/habits/<id> - Delete habit
@habit_routes.route('/<int:habit_id>', methods=['DELETE'])
@login_required
def delete_habit(habit_id):

  habit = Habit.query.filter_by(
    id = habit_id,
    user_id = current_user.id
  ).first_or_404()

  db.session.delete(habit)
  db.session.commit()
  return jsonify({'message': 'Habit deleted successfully!'})
