# User API
> This is the server part of the grpc user manager application. It implements all the protobuf functions in a nest application.

## Endpoints
- **Regsitser**
- **CheckPassword**
- **Find**  (Required auth token)
- **Update** (Required auth token)
- **Update** (Required auth token)
- **UpdatePassword** (Required auth token)
- **Delete** (Required auth token)

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
