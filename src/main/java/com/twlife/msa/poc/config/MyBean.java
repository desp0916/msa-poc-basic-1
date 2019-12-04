package com.twlife.msa.poc.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * https://github.com/spring-cloud/spring-cloud-kubernetes/blob/master/spring-cloud-kubernetes-examples/kubernetes-reload-example/src/main/java/org/springframework/cloud/kubernetes/examples/MyBean.java
 *
 * @author gary
 * @since Dec 4, 2019 2:11:12 PM
 */
@Component
public class MyBean {

	private static final Log log = LogFactory.getLog(MyBean.class);

	@Autowired
	private K8S1Config k8S1Config;

	@Autowired
	private K8S2Config k8S2Config;

	@Scheduled(fixedDelay = 5000)
	public void hello() {
		System.out.println("The first message is: " + this.k8S1Config.getMessage());
		log.info("The first message is: " + this.k8S1Config.getMessage());

		System.out.println("The other property is: " + this.k8S2Config.getProperty());
		log.info("The other property is: " + this.k8S2Config.getProperty());
	}

}

