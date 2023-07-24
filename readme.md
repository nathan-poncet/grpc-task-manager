# ESGI - GRPC Project

> Car racing manager

## Group

- Nathan PONCET
- Léo STEVENOT
- Mohamed BENALIA
- Bastien BREVET

## Functionalities

- 4 APIs
  - [User API](api/user-api/README.md)
  - [Auth API](api/auth-api/README.md)
  - [Car API](api/car-api/README.md)
  - [Race API](api/race-api/README.md)
- Authentication
- Workflow requiring an inter-api
  - In Auth API
  - In Car API
  - In Race API
- Dockerisation
- APIs security
  - Certificates
  - Tokens management
- Reflection
- Multi DBs
  - 1 mysql (Auth, User)
  - 1 mongo (Car)
  - 1 mongo (Race)

## Installation

## Stubs

```shell
# Install stubs
cd proto
npm install -g @bufbuild/buf
sh export.sh
```

## Certs

```shell
cd local/certs

# User API
mkcert user-api localhost
mv user-api+1.pem user.pem
mv user-api+1-key.pem user-key.pem

# Auth API
mkcert auth-api localhost
mv auth-api+1.pem auth.pem
mv auth-api+1-key.pem auth-key.pem
# Car API
mkcert car-api localhost
mv car-api+1.pem car.pem
mv car-api+1-key.pem car-key.pem

# Race API
mkcert race-api localhost
mv race-api+1.pem race.pem
mv race-api+1-key.pem race-key.pem

# Root
cp $(mkcert -CAROOT)/rootCA.pem . # If it doesn't work copy manually the rootCA.pem file

```

## Docker

### Create the docker network

```bash
docker network create grpc-task-manager_default
```

### Launch the databases and tracing tools

```bash
docker compose up -d mariadb mongo tracing
```

### Start all containers

```shell
docker compose up -d
```

## Install User and Auth API and run migrations

- [User API](api/user-api/README.md) documentation
- [Auth API](api/auth-api/README.md) documentation
