FROM node:18.17 As development
WORKDIR /frontend
COPY package*.json ./
RUN npm ci
COPY . .
ENV WS_URL ws://localhost:6969
EXPOSE 3000
CMD ['npm', 'run', 'start:dev']

FROM node:18.17 As production
WORKDIR /frontend
COPY package*.json ./
RUN npm ci
COPY . .
ENV WS_URL wss://dikos-api.herokuapp.com
# Build the app
RUN npm run build:prod
EXPOSE 3000
CMD [ "node", "server.ts" ]