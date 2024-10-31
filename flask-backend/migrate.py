import json
from app import app, db, Entry

# Load JSON data
with open('entries.json') as f:
    data = json.load(f)

# Insert data into the database
with app.app_context():
    for entry in data:
        new_user = Entry(id=entry['id'], service=entry['service'], user=entry['user'], password=entry['password'])
        db.session.merge(new_user)
    db.session.commit()