# Use Node.js base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the frontend code
COPY . .

CMD ["yarn", "dev"]

# Expose port for local access
EXPOSE 3000