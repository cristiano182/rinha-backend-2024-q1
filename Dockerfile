FROM node:20-slim AS base

RUN corepack enable
COPY . /app
WORKDIR /app

ENV PORT=
ENV POSTGRES_URL=
ENV IS_PRIMARY_NODE=
ENV UV_THREADPOOL_SIZE=
ENV POSTGRES_MAX_POOL=
ENV POSTGRES_MIN_POOL=



FROM base AS prod-deps
RUN yarn install

FROM base AS build
RUN yarn install
RUN yarn run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
CMD [ "yarn", "start" ]