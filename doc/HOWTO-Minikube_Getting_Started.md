# HOWTO: minikube Getting Started

## 1. References:

  1. [minikube Examples](https://minikube.sigs.k8s.io/docs/examples/)
  
## 2. See minikube in action!

Start a cluster by running:

``` bash
minikube start
```

Access the Kubernetes Dashboard running within the minikube cluster:

``` bash
minikube dashboard
```

Once started, you can interact with your cluster using `kubectl`, just like any other Kubernetes cluster. For instance, starting a server:

``` bash
kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4
```

Exposing a service as a `NodePort`

``` bash
kubectl expose deployment hello-minikube --type=NodePort --port=8080
```

minikube makes it easy to open this exposed endpoint in your browser:

``` bash
minikube service hello-minikube
```

Start a second local cluster (note: This will not work if minikube is using the bare-metal/none driver):

``` bash
minikube start -p cluster2
```

Stop your local cluster:

``` bash
minikube stop
```

Delete your local cluster:

``` bash
minikube delete
```

Delete all local clusters and profiles

``` bash
minikube delete --all
```

## 

``` bash
kubectl get service hello-minikube --output='jsonpath="{.spec.ports[0].nodePort}"'
kubectl get service hello-minikube --output='json'
```