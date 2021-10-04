FROM node:16-alpine as dev
WORKDIR /usr/app
COPY ["package.json", "yarn.lock", "./"]
RUN npm i -g @nestjs/cli && yarn install
COPY . .
EXPOSE 3000
RUN chown -R node /usr/app
USER node
CMD ["yarn", "start:dev"]

FROM node:16-alpine as build
WORKDIR /usr/app
COPY --from=dev /usr/app ./
RUN yarn build

FROM node:16-alpine as prod
WORKDIR /usr/app
EXPOSE 3000
COPY package.json yarn.lock ./
COPY --from=build /usr/app/dist ./dist
RUN yarn install --production
CMD ["node", "dist/main"]
