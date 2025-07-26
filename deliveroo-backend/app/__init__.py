from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    # Health check
    @app.route('/', methods=['GET'])
    def root():
        return "Deliveroo API is live. Use /index for info."

    @app.route('/index', methods=['GET'])
    def index():
        return "Welcome to Deliveroo Backend Courier Services!"

    @app.route('/profile', methods=['GET'])
    @jwt_required()
    def profile():
        current_user = get_jwt_identity()
        return jsonify(current_user), 200

    # ✅ Import and register routes at the END
    from .routes import register_routes
    register_routes(app)
    return app

# Ensure the app is discoverable
__all__ = ['create_app', 'db']




