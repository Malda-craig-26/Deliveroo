from flask import jsonify
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError

def register_user(data):
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    user = User(username=username, email=email)
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username or email already exists"}), 409

    return jsonify({"message": "User registered successfully"}), 201

def login_user(data):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        token = create_access_token(identity={"id": user.id, "is_admin": user.is_admin})
        return jsonify(access_token=token), 200

    return jsonify({"error": "Invalid credentials"}), 401
