FROM node:8
USER root

ENV YJS_RESOURCE_PATH "/socket.io"
ENV PORT 8070

ENV YJS http://127.0.0.1:1234
ENV WEBHOST http://127.0.0.1:8070
ENV OIDC_CLIENT_ID localtestclient

RUN apt-get update
RUN apt-get install -y --no-install-recommends supervisor git nginx dos2unix chromium
RUN npm_config_user=root npm install -g grunt-cli grunt polymer-cli

COPY docker /usr/src/app/docker
COPY docker/supervisorConfigs /etc/supervisor/conf.d

COPY app /usr/src/app/app
WORKDIR /usr/src/app/app
RUN npm install
RUN dos2unix config.sh

COPY widgets /usr/src/app/widgets
WORKDIR /usr/src/app/widgets
RUN npm install

WORKDIR /usr/src/app
COPY docker/docker-entrypoint.sh docker-entrypoint.sh
RUN dos2unix docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
