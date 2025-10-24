FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the production app (creates dist folder)
RUN npm run build

# Expose port
EXPOSE 3000

# Start production server (serves static files from dist)
CMD ["npm", "start"]
