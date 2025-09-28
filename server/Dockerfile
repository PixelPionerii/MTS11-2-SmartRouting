# Use Node.js 18 Alpine image (lightweight and secure)
FROM node:18-alpine
 
# Set working directory
WORKDIR /app
 
# Install system dependencies for Prisma and other native modules
RUN apk add --no-cache openssl libc6-compat
 
# Copy package.json and package-lock.json (if available)
COPY package*.json ./
 
RUN npm install
 
# Generate Prisma client
RUN npx prisma generate --no-engine
 
# Copy the rest of the application code
COPY . .
 
# Expose port (Cloud Run default)
EXPOSE 3000
 
# Start the application
CMD ["npm", "start"]
 