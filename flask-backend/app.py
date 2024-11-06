import os
from flask import jsonify, request, Flask, make_response
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

print(os.getenv('DATABASE_URL'))

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Optional, to suppress warnings

app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['headers']

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173", "supports_credentials": True}})

    
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

    
# with open('MOCK_DATA.json') as f:
#     data = json.load(f)

# with app.app_context():
#     db.create_all()
#     for entry in data:
#         new_user = Entry(service=entry['service'], user=entry['username'], password=entry['password'])
#         db.session.add(new_user)
#     db.session.commit()

@app.route('/api/auth/login', methods=['POST'])
def login():
    username = request.json['username']
    masterHash = request.json['masterHash']
    if not username and masterHash:
        return jsonify({'message': 'Username and/or password not provided'}), 401
    
    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.masterHash, masterHash):
        access_token = create_access_token(identity=user.id)
        return jsonify({'message': 'Login Success', 'access_token': access_token})
    else:
        return jsonify({'message': 'Login Failed'}), 401
    
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data['user']
    masterHash = data['masterHash']
    if not username or not masterHash:
        return jsonify({'message': 'Username and/or password not provided'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Duplicate username'}), 409

    user = User(username=username, masterHash=masterHash)

    return jsonify({"message": f"User with username {username} added successfully."}), 200


@app.route('/api/entries', methods=['GET'])
@jwt_required()
def get_password():
    user_id = get_jwt_identity()
    entries = Entry.query.filter_by(user_id=user_id)
    entries_list = [entry.to_dict() for entry in entries]
    return jsonify(entries_list)

@app.route('/api/entries', methods=['POST'])
@jwt_required()
def add_password():
    user_id = get_jwt_identity()
    data = request.json
    entry = Entry(service=data['service'], user=data['username'], password=data['password'], user_id=user_id)
    db.session.add(entry)
    db.session.commit()
    return jsonify({"message": f"Entry with ID {id} added successfully."}), 200

@app.route('/api/entries/<id>', methods=['DELETE'])
@jwt_required()
def delete_password(entry_id):
    user_id = get_jwt_identity()
    entry = Entry.query.filter_by(id=entry_id, user_id=user_id).first()

    if entry:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": f"Entry with ID {entry_id} deleted successfully."}), 200
    else:
        return jsonify({"message": f"Entry with ID {entry_id} not found."}), 404

@app.route('/api/entries/<id>', methods=["PUT"])
@jwt_required()
def edit_password(entry_id):
    user_id = get_jwt_identity()
    entry = Entry.query.filter_by(id=entry_id, user_id=user_id).first()
    data = request.json

    if entry:
        entry.service = data.get('service', entry.service)
        entry.user = data.get('user', entry.user)
        entry.password = data.get('password', entry.password)
        db.session.commit()
        return jsonify({"message": f"Entry with ID {entry_id} updated successfully."}), 200
    else:
        return jsonify({"message": f"Entry with ID {entry_id} not found."}), 404

if __name__ == '__main__':
    app.run(debug=True)