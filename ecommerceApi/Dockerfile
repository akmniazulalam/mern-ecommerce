FROM node:22-bookworm-slim AS runner

ARG APP_VERSION=1.0.0
LABEL version=${APP_VERSION}

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD [ "npm", "start" ]