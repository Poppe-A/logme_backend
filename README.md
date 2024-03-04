This repo includes the backend part of the logme app

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository test.

## Installation

```bash
$ yarn
```

## Running the app

```bash
# dev watch mode
$ yarn run start:dev

# with migration
$ start:migrate:dev

# production mode
$ yarn run start:prod
```

## Test (not implented yet)

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Prisma

This project works with Prisma ORM.
Please run the migration before running the project

## CI/CD

A github actions CI/CD pipeline is implemented.
It deploys the project on an AWS EC2 instance, but for costs reason, this instance is not running everytime.

- Start the instance 
- run sudo systemctl start docker
- run docker compose in ngnix folder
- run docker compose with the prod file in logme folder 


Nest is [MIT licensed](LICENSE).
