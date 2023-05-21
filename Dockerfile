# Stage 1: Build the Vue.js application
FROM node:14 AS build

ENV FRONTEND_PORT 8080
ENV BACKEND_PORT 5001
ENV API_URL "http://0.0.0.0"


# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.19.0-alpine AS serve

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
