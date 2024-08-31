FROM node:22.2.0-alpine

COPY package.json app/package.json

WORKDIR /app
RUN npm install

COPY . .

EXPOSE 3000
