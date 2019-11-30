#!/bin/bash

mkdir target/dependency
(cd target/dependency; jar -xf ../*.jar)
docker build -t msa-poc-basic-1 . --no-cache
