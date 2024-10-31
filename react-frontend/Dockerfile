# Use Node.js base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the app for production
RUN npm run build

# Serve the frontend app using a simple HTTP server
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose port for local access
EXPOSE 3000