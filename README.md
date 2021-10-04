## Description

#### Event Creator project, allowing users to create events.

App created for learning purposes only. API written with NestJS/Typescript and frontend with React/Typescript.
MongoDB is used as database.

## Installation

```bash
$ cd client
$ yarn install
$ cd ../api
$ yarn install
```

## Running the app

```bash
# development
$ docker compose -f docker-compose.dev.yml up --build

# production mode
$ docker compose up --build
```

## Test

```bash
# API unit tests
$ cd api
$ yarn test

# API e2e tests
$ docker compose -f docker-compose.dev.yml up mongodb_dev -d
$ cd api
$ yarn test:e2e

# test coverage
$ cd api
$ yarn test:cov
```
