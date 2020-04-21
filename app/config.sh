#!/bin/bash

ENV_VARIABLE_NOT_SET=false
check_if_exists () {
    if [[ -z "$1" ]]; then
        echo "$2 env variable is not set"
        ENV_VARIABLE_NOT_SET=true
    fi
}


check_if_exists "$WEBHOST" "WEBHOST"
check_if_exists "$OIDC_CLIENT_ID" "OIDC_CLIENT_ID"
check_if_exists "$YJS" "YJS"
check_if_exists "$YJS_RESOURCE_PATH" "YJS_RESOURCE_PATH"

sed -i "s={WEBHOST}=$WEBHOST=g" src/static-app.js
sed -i "s={OIDC_CLIENT_ID}=$OIDC_CLIENT_ID=g" src/static-app.js
sed -i "s={YJS_ADDRESS}=$YJS=g" src/static-app.js
sed -i "s={YJS_RESOURCE_PATH}=$YJS_RESOURCE_PATH=g" src/static-app.js
