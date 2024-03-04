#####################
### DEVELOPMENT
#####################

FROM node:20-slim As development

WORKDIR /app
COPY . .

COPY package*.json yarn.lock /app

RUN apt-get update -y && apt-get install -y openssl && apt-get install -y procps

RUN yarn

RUN npx prisma generate 
CMD yarn start:migrate:dev



#####################
### PRODUCTION
#####################

FROM node:20-slim As production

WORKDIR /app

COPY . .
COPY package*.json yarn.lock /app

RUN apt-get update -y && apt-get install -y openssl 

RUN yarn

RUN npx prisma generate 
# RUN npx prisma migrate deploy 

RUN yarn build
RUN ls
CMD yarn start:prod