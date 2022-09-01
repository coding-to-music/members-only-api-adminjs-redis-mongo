# syntax = docker/dockerfile:1

FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --no-cache git
RUN yarn --frozen-lockfile
COPY . .
EXPOSE ${PORT}
CMD yarn start