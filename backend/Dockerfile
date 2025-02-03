# Base image
FROM node:20

# Set the working directory
WORKDIR /app

# Install Nest CLI globally
RUN yarn global add @nestjs/cli

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the application code
COPY . .

# Build the application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]
