FROM node:20.18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN yarn install

COPY . .

RUN yarn build

FROM node:20.18-alpine

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public public

EXPOSE 6500

CMD ["yarn", "start:prod"]
