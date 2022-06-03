FROM node:16.13
WORKDIR /app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=production
COPY . .
# Build the app
RUN npm run build
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]