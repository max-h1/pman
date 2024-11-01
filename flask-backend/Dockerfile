# Use Python base image
FROM python

# Set working directory
WORKDIR /app

# Copy and install backend dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Run the Flask app
CMD ["flask", "run", "--host=127.0.0.1", "--debug"]

# Expose port for backend
EXPOSE 5000