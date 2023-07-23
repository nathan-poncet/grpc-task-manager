# Race API
>This is the server part of the grpc race manager application. It implements all the protobuf functions in a nest application.

## Endpoints
- **ListRace**
- **GerRace**
- **CreateRace** (Required auth token)
- **UpdateRace** (Required auth token)
- **DeleteRace** (Required auth token)
- **SubscribeRaceParticipation** (Required auth token)
- **UnSubscribeRaceParticipation** (Required auth token)
- 
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
