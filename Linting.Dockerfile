FROM node:22-alpine

WORKDIR /usr/src/app

COPY . ./

RUN npm install

RUN npm run lint:all & npm run lint:styles:all & npm run lint:types
