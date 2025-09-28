# Stage 1: Build the React app
FROM node:18-alpine as build
 
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Clean install for production builds
RUN npm install -g npm@11.6.1
# Copy all source code
COPY . .
 
# Build the React app for production (creates dist folder)
RUN npm run build
 
# Stage 2: Serve the built app with Nginx
FROM nginx:alpine
 
# Copy the DIST output to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html
 
# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf
 
# Expose port 80 to serve the app
EXPOSE 80
 
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
