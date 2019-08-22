FROM node:8
USER root

ENV WEBHOST "http:\/\/localhost:8081"
ENV ROLEHOST "http:\/\/127.0.0.1:8073"
ENV YJS "http:\/\/localhost:1234"

# replace this with your application's default port
EXPOSE 8081

COPY . .

RUN npm_config_user=root npm install -g bower grunt-cli grunt
RUN npm install && bower install --allow-root
RUN mv .localGruntConfig.json.sample .localGruntConfig.json
CMD sed -i "s/http:\/\/localhost:8081/${WEBHOST}/g" .localGruntConfig.json \
    && sed -i "s/http:\/\/127.0.0.1:8073/${ROLEHOST}/g" .localGruntConfig.json \
    && sed -i "s/http:\/\/localhost:1234/${YJS}/g" .localGruntConfig.json \
    && cat .localGruntConfig.json \
    && grunt build \
    && grunt connect
