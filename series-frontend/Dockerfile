FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:9090/api/v1
ARG NEXT_PUBLIC_REVIEWS_API_BASE_URL=http://localhost:3010
ARG NEXT_PUBLIC_EMAIL_API_BASE_URL=http://localhost:3021
ARG NEXT_PUBLIC_DEFAULT_LANGUAGE=ua

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_REVIEWS_API_BASE_URL=$NEXT_PUBLIC_REVIEWS_API_BASE_URL
ENV NEXT_PUBLIC_EMAIL_API_BASE_URL=$NEXT_PUBLIC_EMAIL_API_BASE_URL
ENV NEXT_PUBLIC_DEFAULT_LANGUAGE=$NEXT_PUBLIC_DEFAULT_LANGUAGE

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
