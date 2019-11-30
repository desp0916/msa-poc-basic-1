# 部署 spring-cloud-reload 範例程式


# 1. Time Zone

參考：[how to change vm time zone ](https://github.com/kubernetes/minikube/issues/2061)

``` bash 
mkdir -p ~/.minikube/files/etc
cp /etc/localtime  ~/.minikube/files/etc
```

## 1. 啟動 Docker Desktop & minikube

[--extra-config=apiserver.authorization-mode=RBAC causes minikube start to hang: unknown flag: --Authorization.Mode](https://github.com/kubernetes/minikube/issues/2798#issuecomment-387525371)
[Kubernetes](https://minikube.sigs.k8s.io/docs/reference/configuration/kubernetes/)

``` bash
# 1. 啟動 Docker Desktop

# 2. 啟動 minikube (啟動 API Server 的 RBAC 授權模式)
minikube start --extra-config=apiserver.authorization-mode=RBAC
minikube status

# 3. 讓 minikube 共用 Host 的 docker daemon 
eval $(minikube docker-env)

# 4. 啟動 minikube dashboard
minikube dashboard
```

## 2. Create Service Account 
http://192.168.64.14:31094/


vim src/k8s/role.yml

resources: ["pods","configmaps", "secrets"]

```
kubectl create -f src/k8s/role.yml
kubectl create -f src/k8s/sa.yml
kubectl create -f src/k8s/rb.yml
```

As of 1.8, RBAC mode is stable and backed by the rbac.authorization.k8s.io/v1 API.

## 3. 部署 Spring Cloud Reload

參考：[Setting up the Environment](https://github.com/spring-cloud/spring-cloud-kubernetes/tree/master/spring-cloud-kubernetes-examples/kubernetes-reload-example)

``` bash
# 1. 使用 maven 打包、build、deploy Docker image
cd workspace/spring-cloud-kubernetes/spring-cloud-kubernetes-examples/kubernetes-reload-example/
docker images
mvn clean install fabric8:build
mvn fabric8:deploy -Pintegration

# 2. 將「path: /health」改成「path: /actuator/health」
kubectl edit deployment spring-cloud-reload

# vim target/fabric8/applyJson/default/service-spring-cloud-reload.json
# vim target/fabric8/applyJson/default/deployment-spring-cloud-reload.json

# 3. 刪除服務並 expose
kubectl delete service spring-cloud-reload
kubectl expose deployment spring-cloud-reload --type=NodePort --port=8080
minikube service --url spring-cloud-reload

# 4. create config-map
kubectl create -f config-map.yml
```



## 4. 刪除 pod，讓 service 重建 pod

```
kubectl delete service spring-cloud-reload
```

``` bash
kubectl create rolebinding default-sa-binding --clusterrole=cluster-role

```


```
2019-11-25T03:19:30.79419604Z The first message is: Hello World!xxxxx
2019-11-25T03:19:30.794219502Z The other message is: this is a dummy message
2019-11-25T03:19:35.796462804Z 2019-11-25 03:19:35.795 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:35.803223944Z 2019-11-25 03:19:35.802 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:35.805749634Z 2019-11-25 03:19:35.805 DEBUG 1 --- [   scheduling-1] o.s.c.k.config.ConfigMapPropertySource   : The single property with name: [application.properties] will be treated as a properties file
2019-11-25T03:19:35.807691095Z The first message is: Hello World!xxxxx
2019-11-25T03:19:35.807704066Z The other message is: this is a dummy message
2019-11-25T03:19:40.809008114Z 2019-11-25 03:19:40.808 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:40.817979725Z 2019-11-25 03:19:40.817 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:40.8200565Z 2019-11-25 03:19:40.819 DEBUG 1 --- [   scheduling-1] o.s.c.k.config.ConfigMapPropertySource   : The single property with name: [application.properties] will be treated as a properties file
2019-11-25T03:19:40.822130285Z The first message is: Hello World!xxxxx
2019-11-25T03:19:40.822143733Z The other message is: this is a dummy message
2019-11-25T03:19:45.822489145Z 2019-11-25 03:19:45.822 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:45.826960058Z 2019-11-25 03:19:45.826 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:45.828874645Z 2019-11-25 03:19:45.828 DEBUG 1 --- [   scheduling-1] o.s.c.k.config.ConfigMapPropertySource   : The single property with name: [application.properties] will be treated as a properties file
2019-11-25T03:19:45.831350099Z 2019-11-25 03:19:45.831  INFO 1 --- [   scheduling-1] k.c.r.PollingConfigurationChangeDetector : Reloading using strategy: REFRESH
2019-11-25T03:19:45.91199769Z 2019-11-25 03:19:45.911 DEBUG 1 --- [   scheduling-1] ubernetesProfileEnvironmentPostProcessor : 'kubernetes' already in list of active profiles
2019-11-25T03:19:45.98662838Z 2019-11-25 03:19:45.986  INFO 1 --- [   scheduling-1] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.autoconfigure.ConfigurationPropertiesRebinderAutoConfiguration' of type [org.springframework.cloud.autoconfigure.ConfigurationPropertiesRebinderAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)
2019-11-25T03:19:46.070682787Z 2019-11-25 03:19:46.070 DEBUG 1 --- [   scheduling-1] ubernetesProfileEnvironmentPostProcessor : 'kubernetes' already in list of active profiles
2019-11-25T03:19:46.08928638Z 2019-11-25 03:19:46.089 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:46.1487246Z 2019-11-25 03:19:46.147 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:46.151252662Z 2019-11-25 03:19:46.150 DEBUG 1 --- [   scheduling-1] o.s.c.k.config.ConfigMapPropertySource   : The single property with name: [application.properties] will be treated as a properties file
2019-11-25T03:19:46.162689356Z 2019-11-25 03:19:46.162  INFO 1 --- [   scheduling-1] b.c.PropertySourceBootstrapConfiguration : Located property source: CompositePropertySource {name='composite-configmap', propertySources=[ConfigMapPropertySource@2096455111 {name='configmap.reload-example.default', properties={bean.message=Hello World!xxxxx, another.property=value######}}, ConfigMapPropertySource@1994325269 {name='configmap.other.default', properties={}}]}
2019-11-25T03:19:46.162865348Z 2019-11-25 03:19:46.162  INFO 1 --- [   scheduling-1] b.c.PropertySourceBootstrapConfiguration : Located property source: CompositePropertySource {name='composite-secrets', propertySources=[]}
2019-11-25T03:19:46.171154773Z 2019-11-25 03:19:46.166  INFO 1 --- [   scheduling-1] o.s.boot.SpringApplication               : The following profiles are active: kubernetes
2019-11-25T03:19:46.196566072Z 2019-11-25 03:19:46.196  INFO 1 --- [   scheduling-1] o.s.boot.SpringApplication               : Started application in 0.363 seconds (JVM running for 1778.612)
2019-11-25T03:19:46.256083346Z The first message is: Hello World!xxxxx
2019-11-25T03:19:46.256111398Z The other message is: this is a dummy message
2019-11-25T03:19:51.256746174Z 2019-11-25 03:19:51.256 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:51.266195599Z 2019-11-25 03:19:51.265 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:51.268641485Z 2019-11-25 03:19:51.268 DEBUG 1 --- [   scheduling-1] o.s.c.k.config.ConfigMapPropertySource   : The single property with name: [application.properties] will be treated as a properties file
2019-11-25T03:19:51.270576795Z The first message is: Hello World!xxxxx
2019-11-25T03:19:51.270598047Z The other message is: this is a dummy message
2019-11-25T03:19:56.271384624Z 2019-11-25 03:19:56.270 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:56.276366783Z 2019-11-25 03:19:56.276 DEBUG 1 --- [   scheduling-1] o.s.cloud.kubernetes.config.ConfigUtils  : Config Map namespace has not been set, taking it from client (ns=default)
2019-11-25T03:19:56.279073503Z 2019-11-25 03:19:56.278 DEBUG 1 --- [   scheduling-1] o.s.c.k.config.ConfigMapPropertySource   : The single property with name: [application.properties] will be treated as a properties file
2019-11-25T03:19:56.28086883Z The first message is: Hello World!xxxxx
2019-11-25T03:19:56.280902956Z The other message is: this is a dummy message
```
