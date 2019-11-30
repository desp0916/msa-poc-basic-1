#!/bin/sh

kubectl create -f doc/postgresql-external-service.yml
kubectl create -f doc/postgresql-external-endpoints.yml
kubectl apply -f doc/role.yml
kubectl apply -f doc/sa.yml
kubectl apply -f doc/rb.yml
kubectl create secret generic msa-poc-db-secret \
  --from-literal=spring.datasource.username=msa_poc_mgr \
  --from-literal=spring.datasource.password=test123
minikube addons enable storage-provisioner
