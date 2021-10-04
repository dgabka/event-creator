FROM node:16-alpine as dev
WORKDIR /usr/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
EXPOSE 3000
RUN chown -R node /usr/app
USER node
CMD ["yarn", "start"]

FROM node:16-alpine as build
ARG REACT_APP_API_URL
WORKDIR /usr/app
COPY --from=dev /usr/app ./
RUN yarn build

FROM nginx:stable-alpine as prod
COPY --from=build /usr/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]