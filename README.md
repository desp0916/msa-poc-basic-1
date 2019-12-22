# 微服務架構的技術概念驗證 (Microserivces Architecture Proof of Concept) 

本專案主要使用 [spring-cloud-kubernetes](https://github.com/spring-cloud/spring-cloud-kubernetes) 與 [fabric8-maven-plugin](https://github.com/fabric8io/fabric8-maven-plugin)，在本機的 minikube 上運行以 Spring Boot + Spring Cloud 撰寫的應用程式，以進行微服務架構（Microservices Architecture）的技術概念驗證。

## 1. 準備環境

 1. macOS Mojave 10.14.6
 2. Docker Desktop for macOS Community 2.1.0.5
 3. minikube 1.5.2 (包含 kubectl)
 4. OpenJDK 64-Bit Server VM (Zulu 8.20.0.5-macosx) (build 25.121-b15, mixed mode)
 5. Apache Maven 3.6.1
 6. spring-cloud-kubernetes 1.1.0.RC2（定義在 `pom.xml` 中，透過 Maven 下載安裝）
 7. fabric8-maven-plugin 4.3.1（定義在 `pom.xml` 中，不需另外安裝）

## 2. 前置作業

 1. Git clone 本專案
 2. 安裝並啟動 Docker Desktop
 3. 安裝並啟動 PostgreSQL 9.6
 4. 安裝並啟動 minikube，並開啟 minikube dashboard

``` bash
minikube start
eval $(minikube docker-env)
minikube dashboard
```

## 3. 部署至 Minikube

``` bash
# 1. 建立 DB 的 service
kubectl create -f doc/postgresql-external-service.yml
kubectl create -f doc/postgresql-external-endpoints.yml

# 2. 設定 role, roleBbinding 和 serviceAcconunt
kubectl apply -f doc/role.yml
kubectl apply -f doc/sa.yml
kubectl apply -f doc/rb.yml

# 3. 打包成 jar
mvn clean package -DskipTests

# 4. 建立 Resource Descriptors (*.yml)
mvn fabric8:resource

# 5. 建立 Docker image
mvn fabric8:build

# 6. 部署至 Minikube
mvn fabric8:deploy -DskipTests
```

## 4. 測試

``` bash
# 1. 取得 URL
URL=$(minikube service msa-poc-basic-1 --url)

# 2. 設定 curl 的 header

CURL_HEADER='Content-Type:application/json'

# 3. 查詢
curl ${URL}/api/articles

# 4. 新增
curl -X POST -H $CURL_HEADER ${URL}/api/articles/ -d '{"subject": "create subject 2", "content": "create content 2 ..."}'
curl -X POST -H $CURL_HEADER ${URL}/api/articles/ -d '{"subject": "create subject 2", "content": "create content 2 ..."}'
curl -X POST -H $CURL_HEADER ${URL}/api/articles/ -d '{"subject": "create subject 3", "content": "create content 3 ..."}'
curl -X POST -H $CURL_HEADER ${URL}/api/articles/ -d '{"subject": "create subject 4", "content": "create content 4 ..."}'

# 5. 修改
curl -X PATCH -H $CURL_HEADER ${URL}/api/articles/1 -d '{"subject": "update subject 2", "content": "update content 2 ..."}'

# 6. 刪除
curl -X DELETE -H $CURL_HEADER ${URL}/api/articles/1
```

## 5. 移除所有部署

``` bash
mvn fabric8:undeploy
minikube stop
```

## 6. 其他問題

### 6.1 PostgreSQL 的權限問題

``` bash
vim /Library/PostgreSQL/9.6/data/pg_hba.conf
~/bin/restart_postgresql96.sh
```

### 6.2 如果執行「minikube dashboard」，遭遇「`dashboard on none: unexpected response code: 503`」問題時的處理辦法

``` bash
minikube dashboard
🤔  Verifying dashboard health ...
🚀  Launching proxy ...
🤔  Verifying proxy health ...

💣  http://127.0.0.1:49583/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/ is not accessible: Temporary Error: unexpected response code: 503
Temporary Error: unexpected response code: 503
Temporary Error: unexpected response code: 503
Temporary Error: unexpected response code: 503
```
參考：[dashboard on none: unexpected response code: 503 #4352](https://github.com/kubernetes/minikube/issues/4352)

``` bash
kubectl create clusterrolebinding add-on-cluster-admin --clusterrole=cluster-admin --serviceaccount=kube-system:default
```

## 7. 本機開發或執行

請先將 `src/resources/bootstrap.yaml` 以下兩項設為 `false`，以避免因抓不到 configMaps 而拋出 
`io.fabric8.kubernetes.client.KubernetesClientException`：

``` bash
cloud.kubernetes.reload.enabled: false
cloud.kubernetes.config.enabled: false
```

若要在本機打包執行，請在專案根目錄執行以下指令：

``` bash
mvn clean package -DskipTests
java -jar target/msa-poc-basic-1-0.0.1-SNAPSHOT.jar
```

## 8. 參考：

### 8.1 spring-cloud-kubernetes

  1. [GitHub](https://github.com/spring-cloud/spring-cloud-kubernetes)
  2. [文件](https://cloud.spring.io/spring-cloud-static/spring-cloud-kubernetes/1.1.0.RC2/reference/html/)

### 8.2 fabric8-maven-plugin

  1. [GitHub](https://github.com/fabric8io/fabric8-maven-plugin)
  2. [文件](https://maven.fabric8.io/)

### 8.3 其他

  1. [Baeldung - Guide to Spring Cloud Kubernetes](https://www.baeldung.com/spring-cloud-kubernetes)
  2. [Spring - Spring Boot with Docker](https://spring.io/guides/gs/spring-boot-docker/)
  3. [Spring - Topical Guide on Docker](https://spring.io/guides/topicals/spring-boot-docker/)
  4. [Red Hat Developer - Configuring Spring Boot on Kubernetes with Secrets](https://developers.redhat.com/blog/2017/10/04/configuring-spring-boot-kubernetes-secrets/)
  5. [TechBridge 技術共筆部落格 - Kubernetes 與 minikube 入門教學](https://blog.techbridge.cc/2018/12/01/kubernetes101-introduction-tutorial/)
  6. [Spring Boot 静态资源处理](https://blog.csdn.net/isea533/article/details/50412212)

## 附錄 A. Build Docker Image

``` bash
# 1. 編輯 Dockerfile
vim Dockerfile

# 2. Build image
mkdir target/dependency
(cd target/dependency; jar -xf ../*.jar)
docker build -t msa/msa-poc-basic-1 . --no-cache

# 3. 執行容器
docker run --rm -d -p 8080:8080 --name msa-poc-basic-1 msa/msa-poc-basic-1

# 4. 如果您想在 image 內部四處瀏覽，可以像這樣打開其中的 shell（base image 裏沒有 bash）
docker run -ti --entrypoint /bin/sh msa/msa-poc-basic-1

# 5. 如果您有一個正在運行的容器，並且想窺視它，可使用 docker exec：
docker exec -ti msa/msa-poc-basic-1 /bin/sh
```

