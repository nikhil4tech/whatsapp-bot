# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Expose your app's port (change if needed)
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
