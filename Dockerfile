FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn add all

COPY  . .

EXPOSE 3000
CMD [ "npm", "run", "dev" ]