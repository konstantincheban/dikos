# Base image
FROM node:18-alpine As development
# Create app directory
WORKDIR /app
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./
# Install app dependencies
RUN npm install glob rimraf
RUN npm install
# Install Python, pip, cmake, and build tools (gcc, g++, make)
RUN apk add --update \
    python3 \
    py3-pip \
    python3-dev \
    cmake \
    build-base  # This includes gcc, g++ and make

# Copy your Python script
# Assume your Python script is in the 'python' directory in your project
COPY ./requirements.txt ./

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Base image for production
FROM node:18-alpine As production
# Set NODE_ENV environment variable
ENV NODE_ENV production
# Create app directory
WORKDIR /app
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./
# Install production dependencies.
# If you have a package-lock.json, speedier builds with 'npm ci', otherwise use 'npm install --only=production'
RUN npm ci --only=production
# Install Python, pip, cmake, and build tools (gcc, g++, make)
RUN apk add --update \
    python3 \
    py3-pip \
    python3-dev \
    cmake \
    build-base  # This includes gcc, g++ and make

# Copy your Python script
# Assume your Python script is in the 'python' directory in your project
COPY ./requirements.txt ./

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Bundle app source
COPY . .
# Copy the bundled code
COPY --from=development /app/dist ./dist
# Start the server using the production build
EXPOSE ${PORT}
CMD [ "node", "dist/main.js" ]

