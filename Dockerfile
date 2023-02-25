FROM node:16
USER root

RUN apt-get update

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/widgets
RUN npm install
RUN npx rollup -c rollup.config.reduced.js --bundleConfigAsCjs

WORKDIR /usr/src/app/app
RUN npm install
RUN npm run build

WORKDIR /usr/src/app

EXPOSE 8000

# Run the app 
CMD cd /usr/src/app/app && npm run start:prod
