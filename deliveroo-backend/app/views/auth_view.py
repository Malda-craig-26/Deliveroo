from flask import Blueprint, request
from app.presenters.auth_presenter import register_user, login_user

auth_view = Blueprint('auth_view', __name__)

@auth_view.route('/register', methods=['POST'])
def register():
    return register_user(request.get_json())

@auth_view.route('/login', methods=['POST'])
def login():
    return login_user(request.get_json())
