# Race API
>This is the server part of the grpc authentication manager application. It implements all the protobuf functions in a nest application.

## Endpoints
- **Login** (Required auth token)
- **RefreshToken**
- **Validate**

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
### Migrations
```shell
pnpm prisma migrate dev
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
