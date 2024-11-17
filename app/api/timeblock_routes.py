from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, TimeBlock
from datetime import datetime

timeblock_routes = Blueprint('timeblocks', __name__)

# GET /api/timeblocks - Get all timeblocks
@timeblock_routes.route('/', methods=['GET'])
@login_required
def get_timeblocks():
    timeblocks = TimeBlock.query.filter_by(user_id=current_user.id).all()
    return jsonify([timeblock.to_dict() for timeblock in timeblocks])

# POST /api/timeblocks - Create new timeblock
@timeblock_routes.route('/', methods=['POST'])
@login_required
def create_timeblock():
    data = request.get_json()
    
    if not current_user.is_authenticated:
        return jsonify({"errors": {"message": "Unauthorized"}}), 401
    
    try:
        # Parse datetime strings into datetime objects
        start_time = datetime.strptime(data['start_time'], '%Y-%m-%d %H:%M:%S')
        end_time = datetime.strptime(data['end_time'], '%Y-%m-%d %H:%M:%S')
        
        timeblock = TimeBlock(
            user_id=current_user.id,
            name=data['name'],
            description=data.get('description', ''),
            start_time=start_time,
            end_time=end_time
        )
        
        db.session.add(timeblock)
        db.session.commit()
        return jsonify(timeblock.to_dict()), 201
    
    except ValueError as e:
        return jsonify({"errors": {"message": str(e)}}), 400
    except KeyError as e:
        return jsonify({"errors": {"message": f"Missing required field: {str(e)}"}}), 400

# GET /api/timeblocks/<id> - Get specific timeblock
@timeblock_routes.route('/<int:timeblock_id>', methods=['GET'])
@login_required
def get_timeblock(timeblock_id):
    timeblock = TimeBlock.query.filter_by(
        id=timeblock_id,
        user_id=current_user.id
    ).first_or_404()
    return jsonify(timeblock.to_dict())

# PUT /api/timeblocks/<id> - Update timeblock
@timeblock_routes.route('/<int:timeblock_id>', methods=['PUT'])
@login_required
def update_timeblock(timeblock_id):
    timeblock = TimeBlock.query.filter_by(
        id=timeblock_id,
        user_id=current_user.id
    ).first_or_404()
    
    data = request.get_json()
    
    try:
        if 'name' in data:
            timeblock.name = data['name']
        if 'description' in data:
            timeblock.description = data['description']
        if 'start_time' in data:
            timeblock.start_time = datetime.strptime(data['start_time'], '%Y-%m-%d %H:%M:%S')
        if 'end_time' in data:
            timeblock.end_time = datetime.strptime(data['end_time'], '%Y-%m-%d %H:%M:%S')
            
        db.session.commit()
        return jsonify(timeblock.to_dict())
    
    except ValueError as e:
        return jsonify({"errors": {"message": str(e)}}), 400

# DELETE /api/timeblocks/<id> - Delete timeblock
@timeblock_routes.route('/<int:timeblock_id>', methods=['DELETE'])
@login_required
def delete_timeblock(timeblock_id):
    timeblock = TimeBlock.query.filter_by(
        id=timeblock_id,
        user_id=current_user.id
    ).first_or_404()
    
    db.session.delete(timeblock)
    db.session.commit()
    return jsonify({'message': 'TimeBlock deleted successfully!'})

# Optional: GET /api/timeblocks/range - Get timeblocks within a date range
@timeblock_routes.route('/range', methods=['GET'])
@login_required
def get_timeblocks_range():
    start = request.args.get('start')
    end = request.args.get('end')
    
    try:
        start_date = datetime.strptime(start, '%Y-%m-%d') if start else None
        end_date = datetime.strptime(end, '%Y-%m-%d') if end else None
        
        query = TimeBlock.query.filter_by(user_id=current_user.id)
        
        if start_date:
            query = query.filter(TimeBlock.start_time >= start_date)
        if end_date:
            query = query.filter(TimeBlock.end_time <= end_date)
            
        timeblocks = query.all()
        return jsonify([timeblock.to_dict() for timeblock in timeblocks])
    
    except ValueError as e:
        return jsonify({"errors": {"message": "Invalid date format. Use YYYY-MM-DD"}}), 400
