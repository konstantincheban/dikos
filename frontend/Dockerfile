FROM node:16.13
WORKDIR /frontend
COPY package*.json ./
RUN npm ci
COPY . .
# Build the app
RUN npm run build:prod
EXPOSE 3000
CMD [ "node", "server.ts" ]