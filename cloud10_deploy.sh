# "baseUrl" : "http://cloud10.dbis.rwth-aachen.de:8085/cae/syncmeta2/",
# "roleSandboxUrl": "http://cloud10.dbis.rwth-aachen.de:8081/",
# "yjsConnectorUrl" : "http://cloud10.dbis.rwth-aachen.de:8083"

grunt build
echo COPY TO CLOUD10
scp -r html/** cae@cloud10.dbis.rwth-aachen.de:./web/syncmeta