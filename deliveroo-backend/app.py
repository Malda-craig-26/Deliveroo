from flask import Flask, jsonify
from flask_jwt_extended import JWTManager,jwt_required, get_jwt_identity
from app.config import db, migrate, Config
from app.routes import register_routes

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate.init_app(app, db)
jwt = JWTManager(app)

@app.route('/index', methods=['GET'])
def index():
    return "Welcome to Deliveroo Backend Courier Services!"

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify(get_jwt_identity()), 200

# Register Blueprints
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True, port=5555)

