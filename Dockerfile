FROM node:14

LABEL maintainer="shdv" \
      name="hat.sh" \
      version="2.1.0"

WORKDIR /app

COPY ./package.json /app

RUN npm install

COPY . /app

RUN npm run build

COPY . /app

EXPOSE 3991

CMD ["npm", "start"]