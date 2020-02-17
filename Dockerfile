FROM node:12
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]

