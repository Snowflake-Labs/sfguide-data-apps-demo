#!/bin/bash

pushd ~/.ssh
openssl genrsa -out snowflake_demo_key 4096
openssl rsa -in snowflake_demo_key -pubout -out snowflake_demo_key.pub
cat snowflake_demo_key.pub
popd

