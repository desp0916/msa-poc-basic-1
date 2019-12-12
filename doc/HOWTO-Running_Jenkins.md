# Running Jenkins

## 1. docker run

### 1.1 執行

``` bash
docker run \
  -u root \
  --rm \
  -d \
  -p 8080:8080 \
  -p 50000:50000 \
  -e TZ=Asia/Taipei \
  -v "$HOME"/tmp/jenkins_data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock  \
  -v ${HOME}/.m2:/root/.m2 \
  -v "$HOME"/tmp:/home \
  --name jenkins \
  jenkinsci/blueocean
```

### 1.2 取得 Docker Host IP

``` bash
route | awk '/^default/ { print $2 }'
```

## 2. docker-compose

### 2.1 步驟

參考：

  1. [Accessing host machine from within docker container](https://forums.docker.com/t/accessing-host-machine-from-within-docker-container/14248/4)
  2. [建置 Jenkins 分散式架構 ( Master+Slave )](https://tpu.thinkpower.com.tw/tpu/articleDetails/873)

``` bash
# 0. 該終端機視窗不要執行 eval $(minikube docker-env)！
# 1. 建立相關目錄
mkdir -p "$HOME"/tmp/docker/{jenkins_master,jnlp_agent_docker,jnlp_agent_maven}
# 2. 建立網路，以便讓 container 可以連至 docker host
docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 dockernet
# 3. 執行 docker-compose
docker-compose -d -f jenkins-docker-compose.yml up -d
```

## 3. 

jenkins
