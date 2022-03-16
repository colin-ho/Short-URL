FROM node:17-alpine3.14

WORKDIR /app/frontend

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .

RUN npm install --silent

COPY src src

COPY public public

EXPOSE 3000