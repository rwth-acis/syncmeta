FROM node:8
USER root
# replace this with your application's default port
EXPOSE 8081

COPY . .

RUN npm_config_user=root npm install -g bower grunt-cli grunt
RUN npm install
CMD grunt connect
