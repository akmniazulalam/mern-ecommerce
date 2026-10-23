FROM node:22-bookworm-slim AS builder

ARG APP_VERSION=1.0.0
LABEL version=${APP_VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/server.js ./

COPY runner.sh ./

RUN chmod +x runner.sh && chown -R appuser:appgroup /app

EXPOSE 5843

ENTRYPOINT [ "./runner.sh" ]

CMD [ "node", "server.js" ]