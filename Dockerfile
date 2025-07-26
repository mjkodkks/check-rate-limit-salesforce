FROM oven/bun:1.2.18-slim

# Set working directory
WORKDIR /app

# Copy package and lock files
COPY package.json bun.lock tsconfig.json ./

# Install dependencies
RUN bun install

# Copy the rest of the project files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the Bun app
CMD ["bun", "run", "index.tsx"]