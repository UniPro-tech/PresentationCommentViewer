FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

ENV CI=true

RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter web build


FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80