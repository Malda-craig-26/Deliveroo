from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from app.config import db, migrate, Config
from app.models.parcel import Parcel
from app.models.user import User

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate.init_app(app, db)
jwt = JWTManager(app)

from functools import wraps

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


@app.route('/index', methods=['GET'])
def index():
    return "Welcome to Deliveroo Backend Courier Services!"

@app.route('/register', methods=['POST'])
def register():
    from app.presenters.auth_presenter import register_user
    data = request.get_json()
    return register_user(data)

@app.route('/login', methods=['POST'])
def login():
    from app.presenters.auth_presenter import login_user
    data = request.get_json()
    return login_user(data)

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify(current_user), 200

@app.route('/parcels', methods=['GET'])
@jwt_required()
def get_parcels():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user and user.role == 'admin':
        parcels = Parcel.query.all()
    else:
        parcels = Parcel.query.filter_by(user_id=current_user_id).all()
    return jsonify([parcel.to_dict() for parcel in parcels]), 200

@app.route('/parcels', methods=['POST'])
@jwt_required()
def create_parcel():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    parcel = Parcel(
        weight=data['weight'],
        pickup_location=data['pickup_location'],
        destination=data['destination'],
        user_id=current_user_id
    )
    db.session.add(parcel)
    db.session.commit()
    return jsonify(parcel.to_dict()), 201

@app.route('/parcels/<int:parcel_id>', methods=['GET'])
@jwt_required()
def get_parcel(parcel_id):
    parcel = Parcel.query.get_or_404(parcel_id)
    return jsonify(parcel.to_dict()), 200

@app.route('/parcels/<int:parcel_id>', methods=['PATCH'])
@jwt_required()
def update_parcel(parcel_id):
    data = request.get_json()
    parcel = Parcel.query.get_or_404(parcel_id)
    current_user_id = get_jwt_identity()

    if parcel.user_id != current_user_id:
        return jsonify({"error": "You do not have permission to update this parcel"}), 403

    if 'destination' in data:
        parcel.destination = data['destination']

    db.session.commit()
    return jsonify(parcel.to_dict()), 200

@app.route('/parcels/<int:parcel_id>', methods=['DELETE'])
@jwt_required()
def delete_parcel(parcel_id):
    parcel = Parcel.query.get_or_404(parcel_id)
    current_user_id = get_jwt_identity()

    if parcel.user_id != current_user_id:
        return jsonify({"error": "You do not have permission to delete this parcel"}), 403

    db.session.delete(parcel)
    db.session.commit()
    return jsonify({"message": "Parcel deleted successfully"}), 200

@app.route('/admin/parcels/<int:id>', methods=['PATCH'])
@admin_required
def admin_update_parcel(id):
    data = request.get_json()
    parcel = Parcel.query.get_or_404(id)

    if 'status_id' in data:
        parcel.status_id = data['status_id']
    if 'destination' in data:
        parcel.destination = data['destination']
    if 'present_location' in data:
        parcel.present_location = data['present_location']
        

    db.session.commit()
    return jsonify(parcel.to_dict()), 200

@app.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/admin/assign-role', methods=['POST'])
@admin_required
def assign_role():
    data = request.get_json()
    user_id = data.get('user_id')
    role = data.get('role')
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.role = role
    db.session.commit()
    return jsonify(user.to_dict()), 200


if __name__ == "__main__":
    app.run(debug=True, port=5555)
