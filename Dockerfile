FROM node:18-alpine As development

WORKDIR /app

COPY package*.json yarn.lock /app

RUN yarn

COPY . /app
RUN npx prisma generate 
CMD yarn start:migrate:dev