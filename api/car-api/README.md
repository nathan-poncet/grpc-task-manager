# Car API
> This is the server part of the grpc car manager application. It implements all the protobuf functions in a nest application.

## Endpoints
- **ListCar**
- **GerCar**
- **CreateCar** (Required auth token)
- **UpdateCar** (Required auth token)
- **DeleteCar** (Required auth token)

## Installation
### Environment vars
```bash
cp .env.example .env # Copy and config .env
```
### Dependencies
```shell
pnpm install
pnpm install -g prisma 
```

## Running the app
```bash
# development
pnpm run start
# watch mode
pnpm run start:dev
# production mode
pnpm run start:prod
```
