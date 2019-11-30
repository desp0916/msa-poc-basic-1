# Refs:
#
# 1. https://spring.io/guides/topicals/spring-boot-docker/
# 2. https://stackoverflow.com/questions/46057625/externalising-spring-boot-properties-when-deploying-to-docker
# 3. https://stackoverflow.com/questions/30494050/how-do-i-pass-environment-variables-to-docker-containers
# 4. https://docs.spring.io/spring-boot/docs/1.5.7.RELEASE/reference/htmlsingle/#boot-features-external-config-application-property-files
# 5. https://hub.docker.com/r/gprime44/amazondatamanager/dockerfile
# 6. https://yeasy.gitbooks.io/docker_practice/image/dockerfile/entrypoint.html
#
FROM openjdk:8-jdk-alpine

MAINTAINER Gary Liu <Desp.Liu@taiwanlife.com>

EXPOSE 8080

VOLUME [ "/tmp", "/config", "/data" ]

RUN addgroup -S apmgr && adduser -S apmgr -G apmgr
USER apmgr

ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app

ENV JAVA_OPTS "-server -Djava.net.preferIPv4Stack=true -Djava.security.egd=file:/dev/./urandom -Dspring.profiles.active=minikube"

# Run the jar file
#ENTRYPOINT [ "/bin/sh", "-c", "java -server $JAVA_OPTS -Djava.net.preferIPv4Stack=true -Djava.security.egd=file:/dev/./urandom -jar app.jar ${0} ${@}" ]
#ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar /app.jar ${0} ${@}"]
ENTRYPOINT ["sh", "-c", "java", "-cp", "app:app/lib/*", "com.twlife.msa.poc.Application"]
