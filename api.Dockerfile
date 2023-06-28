FROM --platform=linux/amd64 vanguardapps/hub:preamly-api-base

ARG MONGO_API_CONN_STR

ENV MONGO_API_CONN_STR=${MONGO_API_CONN_STR}
ENV NODE_ENV=production

COPY . .

RUN apk add bash make g++ python3 \
    && npm install -g pnpm typescript \
    && pnpm install --prod --frozen-lockfile \
    && tsc

EXPOSE 4000

HEALTHCHECK CMD curl --fail http://localhost:3001 || exit 1   

CMD [ "node", "dist/bundle.js" ]
