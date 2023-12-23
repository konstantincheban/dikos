# Base image
FROM python:3.9-slim As development
# Create app directory
WORKDIR /app
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install app dependencies
RUN npm install glob rimraf
RUN npm install

# Create a virtual environment and activate it
RUN python3 -m venv /usr/src/app/venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

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
FROM python:3.9-slim As production
# Set NODE_ENV environment variable
ENV NODE_ENV production
# Create app directory
WORKDIR /app
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install production dependencies.
# If you have a package-lock.json, speedier builds with 'npm ci', otherwise use 'npm install --only=production'
RUN npm ci --only=production

# Create a virtual environment and activate it
RUN python3 -m venv /usr/src/app/venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

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
EXPOSE 6969
EXPOSE 6060
CMD [ "node", "dist/main.js" ]

