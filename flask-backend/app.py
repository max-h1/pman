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
    id = db.Column(db.Integer, primary_key=True)
    service = db.Column(db.String(128), index=True)
    user = db.Column(db.String(128))
    password = db.Column(db.String(128))

    def __repr__(self):
        return f'Entry: Service = {self.service} | User = {self.user}'

CORS(app)


with open('entries.json', "r") as f:
    entries = json.load(f)



@app.route('/api/entries', methods=['GET'])
def get_password():
    return entries

@app.route('/api/entries', methods=['POST'])
def add_password():
    data = request.json
    entries.append(data)
    with open('entries.json', "w") as fw:
        json.dump(entries, fw)
    fw.close
    return jsonify(data), 201

@app.route('/api/entries/<id>', methods=['DELETE'])
def delete_password(id):
    updated_entries = [entry for entry in entries if entry["id"] != id]
    with open('entries.json', "w") as fw:
        json.dump(updated_entries, fw)
    fw.close
    return updated_entries, 200

@app.route('/api/entries/<id>', methods=["PUT"])
def edit_password(id):
    updated_entry = request.data
    [updated_entry for entry in entries if entry["id"] == id]
    with open('entries.json', "w") as fw:
        json.dump(entries, fw)
    fw.close
    return updated_entry, 200

if __name__ == '__main__':
    app.run(debug=True)