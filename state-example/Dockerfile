FROM node:10-alpine AS base
WORKDIR /app

FROM base AS builder
COPY . .
RUN yarn --frozen-lockfile --non-interactive --production

FROM base AS release
ENV NODE_ENV production
COPY --from=builder --chown=1000:1000 /app/src ./src
COPY --from=builder --chown=1000:1000 /app/node_modules ./node_modules
USER 1000:1000
EXPOSE 8080
CMD [ "node", "src/state.js" ]