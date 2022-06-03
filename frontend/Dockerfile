FROM node:16.13
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build the app
RUN npm run build:prod
EXPOSE 3000
CMD [ "node", "server.ts" ]