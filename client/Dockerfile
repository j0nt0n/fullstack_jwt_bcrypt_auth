# Use a Node.js base image
FROM node:alpine as build

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app for production
RUN npm run build

# Use nginx to serve the static files
FROM nginx:stable-alpine

# Copy built files from the previous stage
EXPOSE 8000

# Start nginx
CMD ["npm", "Start", "dev"]