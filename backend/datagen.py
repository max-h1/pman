import random
import string
from faker import Faker
from flask_bcrypt import generate_password_hash
from your_flask_app import app, db  # Adjust the import based on your app structure
from your_flask_app.models import User, PasswordEntry  # Adjust the import based on your models

# Initialize Faker
fake = Faker()

# Define the number of mock users and entries per user
NUM_USERS = 10
ENTRIES_PER_USER = 5

# Helper function to create a hashed password
def create_hashed_password(password):
    return generate_password_hash(password)

# Function to create mock users
def create_mock_users():
    users = []
    for _ in range(NUM_USERS):
        username = fake.user_name()
        passwordHash = create_hashed_password(fake.password())
        user = User(username=username, passwordHash=passwordHash)
        db.session.add(user)
        users.append(user)
    db.session.commit()
    return users

# Function to create mock password entries for each user
def create_mock_entries(users):
    for user in users:
        for _ in range(ENTRIES_PER_USER):
            entry = PasswordEntry(
                service=fake.company(),
                username=fake.user_name(),
                password=fake.password(),
                user_id=user.id
            )
            db.session.add(entry)
    db.session.commit()

# Main function to populate the database
def populate_database():
    with app.app_context():  # Ensure app context for db access
        db.drop_all()        # Optional: Clear the database
        db.create_all()       # Create tables if they don't exist

        # Create users and password entries
        users = create_mock_users()
        create_mock_entries(users)

        print(f"Created {NUM_USERS} users with {ENTRIES_PER_USER} entries each.")

# Run the script
if __name__ == "__main__":
    populate_database()