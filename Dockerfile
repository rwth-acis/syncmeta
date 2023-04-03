FROM node:16
USER root

RUN apt-get update

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app
RUN npm ci
RUN npx rollup -c rollup.config.dev.js --bundleConfigAsCjs

WORKDIR /usr/src/app/example-app

RUN npm ci
RUN npm run build

WORKDIR /usr/src/app

EXPOSE 8000

# Run the app 
CMD cd /usr/src/app/example-app && npm run start:prod
