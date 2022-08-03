FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
EXPOSE 3000
CMD yarn start