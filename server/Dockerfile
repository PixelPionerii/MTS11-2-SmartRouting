# Use Node.js 18 Alpine image (lightweight and secure)

FROM node:18-alpine
 
# Set working directory

WORKDIR /app
 
# Install system dependencies for Prisma and other native modules

RUN apk add --no-cache openssl libc6-compat
 
# Copy package.json and package-lock.json (if available)

COPY package*.json ./
 
# Install dependencies

RUN npm install
 
# Copy Prisma schema BEFORE generating client

COPY prisma ./prisma/
 
# Generate Prisma client (now that schema.prisma exists)

RUN npx prisma migrate reset

RUN npx prisma migrate dev --name "prod"

RUN npx prisma generate
 
# Copy the rest of the application code

COPY . .
 
# Expose port 8080 (Cloud Run default, not 3000)

EXPOSE 8080
 
# Start the application

CMD ["npm", "start"]
 