FROM node:17-alpine3.14

WORKDIR /app/frontend

COPY package.json .

COPY ./package-lock.json .

RUN npm install --silent

COPY . .