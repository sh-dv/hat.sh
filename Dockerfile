#############################
#       DEPENDENCIAS
#############################
FROM node:18-alpine AS deps
WORKDIR /app

# Necesario para que SWC funcione en Alpine
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci


#############################
#           BUILD
#############################
FROM node:18-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


#############################
#          NGINX
#############################
FROM nginx:stable-alpine

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 3991

ENTRYPOINT ["nginx", "-g", "daemon off;"]
