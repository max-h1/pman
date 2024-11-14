import os
from functools import wraps
from flask import jsonify, request, Flask, session
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt, set_access_cookies
from flask_migrate import Migrate
from dotenv import load_dotenv
from datetime import datetime
from datetime import timedelta
from datetime import timezone

load_dotenv()

app = Flask(__name__)

print(os.getenv('DATABASE_URL'))

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+mysqlconnector://development:beenis@db/pman"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Optional, to suppress warnings

app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=10)
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_COOKIE_HTTPONLY'] = True
app.config['JWT_COOKIE_CSRF_PROTECT'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), unique=True)
    masterHash = db.Column(db.String(128))
    entries = db.relationship('Entry', backref='user', lazy=True)

    def __repr__(self):
        return f'User: {self.username}'
    
class Entry(db.Model):
    __tablename__ = 'entries'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    service = db.Column(db.String(128), index=True) 
    username = db.Column(db.String(128))
    password = db.Column(db.String(128))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'Entry: Service = {self.service} | User = {self.username}'
    
    def to_dict(self):
        return {"id": self.id, "service": self.service, "user": self.username, "password": self.password}

    
# @app.after_request
# def refresh_expiring_jwts(response):
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if target_timestamp > exp_timestamp:
#             access_token = create_access_token(identity=get_jwt_identity())
#             set_access_cookies(response, access_token)
#         return response
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original response
#         return response

SESSION_TIMEOUT = timedelta(minutes=5)

def private(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"message": "Unauthorized: No valid session"}), 401
        if 'last_activity' in session:
            # Calculate how long since the last activity
            last_activity = session['last_activity']
            now = datetime.now(timezone.utc)
            if now - last_activity > SESSION_TIMEOUT:
                # Session has timed out
                session.clear()
                return jsonify({"message": "Session expired"}), 401
        # Update last activity time
        session['last_activity'] = datetime.now(timezone.utc)
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/auth/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    if not username or not password:
        return jsonify({'message': 'Username and/or password not provided'}), 401
    
    user = User.query.filter_by(username=username).first()

    # Error checking
    if not user:
        return jsonify({'message': 'User does not exist'}), 401
    if not bcrypt.check_password_hash(user.masterHash, password):
        return jsonify({'message': 'Incorrect password'}), 401
    
    session['user_id'] = user.id
    session['last_activity'] = datetime.now(timezone.utc)
    
    
    # Returning token
    # access_token = create_access_token(identity=user.id)
    # response = jsonify({'message': 'Login Success'})
    # set_access_cookies(response, access_token)

    return jsonify({'message': 'Login Success'}), 200
    
    
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data['user']
    password = data['password']
    if not username or not password:
        return jsonify({'message': 'Username and/or password not provided'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Duplicate username'}), 409
    
    masterHash = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(username=username, masterHash=masterHash)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": f"User with username {username} added successfully."}), 200


@app.route('/api/entries', methods=['GET'])
# @jwt_required()
@private
def get_password():
    # user_id = get_jwt_identity()
    user_id = session['user_id']
    entries = Entry.query.filter_by(user_id=user_id)
    entries_list = [entry.to_dict() for entry in entries]
    return jsonify(entries_list)

@app.route('/api/entries', methods=['POST'])
# @jwt_required()
@private
def add_password():
    # user_id = int(get_jwt_identity())
    user_id = session['user_id']
    data = request.json
    entry = Entry(
        service=str(data['service']),
        username=str(data['user']),
        password=str(data['password']),
        user_id=user_id)
    db.session.add(entry)
    db.session.commit()
    return jsonify({"message": f"Entry added successfully.", "id": entry.id}), 200

@app.route('/api/entries/<entry_id>', methods=['DELETE'])
# @jwt_required()
@private
def delete_password(entry_id):
    # user_id = get_jwt_identity()
    user_id = session['user_id']
    entry = Entry.query.filter_by(id=entry_id, user_id=user_id).first()

    if entry:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": f"Entry with ID {entry_id} deleted successfully."}), 200
    else:
        return jsonify({"message": f"Entry with ID {entry_id} not found."}), 404

@app.route('/api/entries/<entry_id>', methods=["PUT"])
# @jwt_required()
@private
def edit_password(entry_id):
    # user_id = get_jwt_identity()
    user_id = session['user_id']
    entry = Entry.query.filter_by(id=entry_id, user_id=user_id).first()
    data = request.json

    if entry:
        entry.service = data['service']
        entry.username = data['user']
        entry.password = data['password']
        db.session.commit()
        return jsonify({"message": f"Entry with ID {entry_id} updated successfully."}), 200
    else:
        return jsonify({"message": f"Entry with ID {entry_id} not found."}), 404

if __name__ == '__main__':
    app.run(debug=True)