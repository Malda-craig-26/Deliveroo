from flask import jsonify
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from email_validator import validate_email, EmailNotValidError


def register_user(data: dict):
    """
    Register a new user.
    """
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({
            "status": "error",
            "message": "All fields (username, email, password) are required."
        }), 400

    try:
        validate_email(email)
    except EmailNotValidError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    user = User(username=username, email=email)
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Username or email already exists."
        }), 409

    return jsonify({
        "status": "success",
        "message": "User registered successfully.",
        "data": {
            "user_id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 201


def login_user(data: dict):
    """
    Authenticate a user and return a JWT token.
    """
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        token = create_access_token(identity={
            "id": user.id,
            "is_admin": user.is_admin
        })

        return jsonify({
            "status": "success",
            "message": "Login successful.",
            "access_token": token
        }), 200

    return jsonify({
        "status": "error",
        "message": "Invalid email or password."
    }), 401


