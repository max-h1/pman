# Use Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy and install backend dependencies

COPY requirements.txt .
RUN pip install -r requirements.txt 

# Copy the rest of the backend code
COPY . .

# Run the Flask app
CMD ["sh", "-c", "python datagen.py && flask run --host=0.0.0.0 --debug"]

# Expose port for backend
EXPOSE 5000