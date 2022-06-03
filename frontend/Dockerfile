FROM node:16.13

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Build the app
RUN npm run build:prod
COPY /usr/src/app/dist ./dist
EXPOSE 3000
CMD [ "node", "server.ts" ]