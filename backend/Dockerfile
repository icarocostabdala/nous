FROM node:20

WORKDIR /app

RUN yarn global add @nestjs/cli

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

RUN mkdir -p /app/data && cp /app/src/data/movielist.csv /app/data/movielist.csv

EXPOSE 3000

CMD ["yarn", "start:prod"]
