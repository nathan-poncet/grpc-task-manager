FROM mohammaddocker/nest-prisma as development

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml",  "./"]

RUN pnpm install

COPY prisma ./prisma/

RUN prisma generate

COPY . .

ENV NODE_ENV=development

CMD pnpm start:dev


FROM mohammaddocker/nest-prisma as production

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml",  "./"]

RUN pnpm install --prod

COPY prisma ./prisma/

RUN prisma generate

COPY . .

RUN nest build

ENV NODE_ENV=production

COPY src/proto dist/proto

CMD pnpm start:prod
