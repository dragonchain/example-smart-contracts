FROM node:12-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --frozen-lockfile --non-interactive --production

FROM base AS release
COPY --chown=1000:1000 ./src ./src
COPY --from=builder --chown=1000:1000 /app/node_modules ./node_modules
USER 1000:1000