# -------------------------
# Builder
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && \
  corepack prepare pnpm@11.9.0 --activate


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/server/package.json apps/server/package.json
COPY packages/shared/package.json packages/shared/package.json

ENV CI=true

RUN pnpm install --frozen-lockfile


COPY . .


RUN pnpm --filter server build


# -------------------------
# Runtime
# -------------------------
FROM node:22-alpine AS runtime

WORKDIR /app

RUN corepack enable && \
  corepack prepare pnpm@11.9.0 --activate


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/server/package.json apps/server/package.json
COPY packages/shared/package.json packages/shared/package.json

ENV CI=true

RUN pnpm install \
  --frozen-lockfile \
  --prod


COPY --from=builder \
  /app/apps/server/dist \
  /app/apps/server/dist


CMD ["pnpm","--filter","server","start"]