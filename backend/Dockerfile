FROM node:24-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-slim AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/src/main.js"]
