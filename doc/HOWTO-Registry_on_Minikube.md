# 在 Minikube 中建立一個 Docker Image Registry


## 1. Use localhost:5000 as the registry

[Sharing a local registry with minikube](https://blog.hasura.io/sharing-a-local-registry-for-minikube-37c7240d0615/)

``` bash
# 1. Create a registry on minikube
kubectl create -f kube-registry.yaml

# 2. Map the host port 5000 to minikube registry pod
kubectl port-forward --namespace kube-system $(kubectl get po -n kube-system | grep kube-registry-v0 | awk '{print $1;}') 5000:5000

# 3. Non-linux peoples: Map docker-machine’s 5000 to the host’s 5000.
ssh -i ~/.docker/machine/machines/default/id_rsa -R 5000:localhost:5000 \docker@$(docker-machine ip)
```
