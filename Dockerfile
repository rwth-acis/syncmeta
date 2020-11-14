FROM node:8
USER root

ENV YJS_RESOURCE_PATH "/socket.io"
ENV PORT 8070

WORKDIR /usr/src/app
COPY . .

RUN apt-get update
RUN apt-get install -y --no-install-recommends supervisor git nginx
RUN npm_config_user=root npm install -g bower grunt-cli grunt polymer-cli

COPY docker/supervisorConfigs /etc/supervisor/conf.d

WORKDIR /usr/src/app/widgets
RUN npm install && bower install --allow-root

WORKDIR /usr/src/app/app
RUN npm install

WORKDIR /usr/src/app
COPY docker/docker-entrypoint.sh docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
