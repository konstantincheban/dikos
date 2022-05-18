FROM node:16.13 AS development

# Create an application directory
RUN mkdir -p /frontend

# The /app directory should act as the main application directory
WORKDIR /frontend

# Copy the app package and package-lock.json file
COPY frontend/package*.json ./

# Install node packages
RUN npm install

# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY frontend/ .

# Build the app
RUN npm run build

EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]