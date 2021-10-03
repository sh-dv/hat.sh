FROM node:14

LABEL maintainer="sh-dv" \
      name="hat.sh" \
      version="2.0.9"

WORKDIR /app

COPY ./package.json /app

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 3991

CMD ["npm", "start"]