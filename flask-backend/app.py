from flask import jsonify, request, Flask
from flask_cors import CORS
from flask_mysqldb import MySQL
import json

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'flask'
 
mysql = MySQL(app)

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