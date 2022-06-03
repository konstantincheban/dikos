FROM node:16.13 AS development

# Create an application directory
RUN mkdir -p /frontend
# The /app directory should act as the main application directory
WORKDIR /usr/src/app
# Copy the app package and package-lock.json file
COPY package*.json ./
# Install node packages
RUN npm install
# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY . .
# Build the app
RUN npm run build
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]

FROM node:16.13 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
# Build the app
RUN npm run build:prod
COPY --from=development /usr/src/app/dist ./dist
EXPOSE 3000
CMD [ "node", "server.ts" ]