from flask import jsonify, request, Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

entries = []

@app.route('/api/entries', methods=['GET'])
def get_passwords():
    return jsonify(entries)

def add_password():
    data = request.json
    entries.append(data)
    return jsonify(data), 201

if __name__ == '__main__':
    app.run(debug=True)