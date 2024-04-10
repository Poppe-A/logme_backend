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

```bash
# create new miration when updating pirsma schema
$ npx prisma migrate dev --name "migration_name"


# update prisma generated types
$ npx prisma generate

```

## CI/CD

A github actions CI/CD pipeline is implemented.
It deploys the project on an AWS EC2 instance, but for costs reason, this instance is not running everytime.

- Start the instance
- run sudo systemctl start docker
- run docker compose in ngnix folder
- run docker compose with the prod file in logme folder

Nest is [MIT licensed](LICENSE).

TODO :

- Make stuff can be updated and deleted only by its owner
- Error handling (watch the typing)
- Find a better way to return a session. It's currently formatted in the backend,
  but it's not perfect because the front end need to get the whole session returned on every update.
  I need to do the formatting on the front, or handle the update properly
