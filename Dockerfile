FROM node:alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

# build
RUN npm run build


FROM nginx:stable-alpine

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 3991

ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["nginx", "-g", "daemon off;"]