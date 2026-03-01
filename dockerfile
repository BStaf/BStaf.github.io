# Stage 1: Build the site
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the site
RUN npm run build

# Stage 2: Serve the site
FROM node:20-alpine

# Install a minimal HTTP server (serve)
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files and index.html
COPY --from=build /app/dist ./dist
#COPY --from=build /app/public/index.html ./

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["serve", "-s", "dist", "-l", "5000"]
