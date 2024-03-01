#####################
### DEVELOPMENT
#####################

FROM node:20-slim As development

WORKDIR /app

COPY package*.json yarn.lock /app

RUN apt-get update -y && apt-get install -y openssl

RUN yarn

COPY . /app
RUN npx prisma generate 
CMD yarn start:migrate:dev



#####################
### PRODUCTION
#####################

FROM node:20-slim  As production

WORKDIR /app

COPY package*.json yarn.lock ./

RUN apt-get update -y && apt-get install -y openssl

RUN yarn

COPY . .
RUN npx prisma generate 

RUN yarn build
# CMD [ "cd", "dist" ]
# CMD [ "ls"]
CMD [ "node", "dist/src/main.js"]