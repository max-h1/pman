import os
from flask import jsonify, request, Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import json
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

db_user = os.environ.get('DB_USER')
db_password = os.environ['DB_PASSWORD']
db_name = os.environ['DB_NAME']

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{db_user}:{db_password}@localhost/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Optional, to suppress warnings

# Initialize the SQLAlchemy object
db = SQLAlchemy(app)

class Entry(db.Model):
    __tablename__ = 'entries'
    id = db.Column(db.String(128), primary_key=True)
    service = db.Column(db.String(128), index=True)
    user = db.Column(db.String(128))
    password = db.Column(db.String(128))

    def __repr__(self):
        return f'Entry: Service = {self.service} | User = {self.user}'
    
    def to_dict(self):
        return {"id": self.id, "service": self.service, "user": self.user, "password": self.password}

CORS(app)

@app.route('/api/entries', methods=['GET'])
def get_password():
    entries = Entry.query.all()
    entries_list = [entry.to_dict() for entry in entries]
    return jsonify(entries_list)

@app.route('/api/entries', methods=['POST'])
def add_password():
    data = request.json
    entry = Entry(id=data['id'], service=data['service'], user=data['user'], password=data['password'])
    db.session.add(entry)
    db.session.commit()
    return jsonify({"message": f"Entry with ID {id} added successfully."}), 200

@app.route('/api/entries/<id>', methods=['DELETE'])
def delete_password(id):
    entry = db.session.get(Entry, id)

    if entry:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": f"Entry with ID {id} deleted successfully."}), 200
    else:
        return jsonify({"message": f"Entry with ID {id} not found."}), 404

@app.route('/api/entries/<id>', methods=["PUT"])
def edit_password(id):
    entry = db.session.get(Entry, id)
    data = request.json

    if entry:
        entry.service = data.get('service', entry.service)
        entry.user = data.get('user', entry.user)
        entry.password = data.get('password', entry.password)
        db.session.commit()
        return jsonify({"message": f"Entry with ID {id} updated successfully."}), 200
    else:
        return jsonify({"message": f"Entry with ID {id} not found."}), 404

if __name__ == '__main__':
    app.run(debug=True)