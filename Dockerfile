#https://hub.docker.com/_/node
#https://hub.docker.com/_/nginx

FROM node:latest as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build
FROM nginx:latest
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 3991
ENTRYPOINT ["nginx", "-g", "daemon off;"]
