from flask import jsonify, request, Flask

app = Flask(__name__)

passwords = []

@app.route('/api/passwords', methods=['GET'])
def get_passwords():
    return jsonify(passwords)

def add_password():
    data = request.json
    passwords.append(data)
    return jsonify(data), 201

if __name__ == '__main__':
    app.run(debug=True)