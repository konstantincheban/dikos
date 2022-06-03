FROM node:16.13
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY /usr/src/app/dist ./dist
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]