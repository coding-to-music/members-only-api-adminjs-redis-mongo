FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .

RUN --mount=type=secret,id=DB_URL,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=COOKIE_SECRET,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=ACCESS_TOKEN_PRIVATE_KEY_BASE64,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=ACCESS_TOKEN_PUBLIC_KEY_BASE64,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=ACCESS_TOKEN_SECRET,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=REFRESH_TOKEN_PRIVATE_KEY_BASE64,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=REFRESH_TOKEN_PUBLIC_KEY_BASE64,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=REFRESH_TOKEN_SECRET,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=SENDER_IDENTITY,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=SENDGRID_API_KEY,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=REDIS_HOST,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=REDIS_USERNAME,dst=/etc/secrets/.env cat /etc/secrets/.env \
    --mount=type=secret,id=REDIS_PASSWORD,dst=/etc/secrets/.env cat /etc/secrets/.env

EXPOSE 3000
CMD yarn start