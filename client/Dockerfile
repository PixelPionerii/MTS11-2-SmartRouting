FROM node:20-alpine

WORKDIR /app

# Install dependencies for building
RUN apk add --no-cache git python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies without package-lock
RUN rm -f package-lock.json && npm install

# Copy source
COPY . .

# Build
RUN npm run build

# Use simple HTTP server instead of nginx
RUN npm install -g serve

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
