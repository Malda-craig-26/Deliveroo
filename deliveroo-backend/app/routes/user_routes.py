from flask import Blueprint, jsonify, request
from app.models.user import User
from app.utils.decorators import admin_required
from app.extensions import db

from sqlalchemy.sql import func

user_bp = Blueprint('user_bp', __name__, url_prefix='/users')

@user_bp.route('', methods=['GET'])
@admin_required
def get_users():
    role = request.args.get("role")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    query = User.query.filter_by(is_deleted=False)

    if role:
        query = query.filter(User.role.ilike(role))
    pagination = query.paginate(page, per_page, error_out=False)
    users = [user.to_dict() for user in pagination.items]

    return jsonify({
        "users": users,
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages
    }), 200


# POST /users/assign-role
@user_bp.route('/assign-role', methods=['POST'])
@admin_required
def assign_role():
    data = request.get_json()
    user_id = data.get('user_id')
    role = data.get('role')

    if not user_id or not role:
        return jsonify({"error": "user_id and role are required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.role = role
    db.session.commit()
    return jsonify(user.to_dict()), 200

# Soft DELETE /users/<int:user_id>
@user_bp.route('/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_deleted = True
    db.session.commit()
    return jsonify({"message": f"User {user.email} soft-deleted successfully"}), 200


    
