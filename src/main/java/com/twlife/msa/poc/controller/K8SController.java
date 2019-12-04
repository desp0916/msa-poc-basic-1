package com.twlife.msa.poc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * https://github.com/spring-cloud/spring-cloud-kubernetes/blob/master/spring-cloud-kubernetes-examples/kubernetes-hello-world-example/src/main/java/org/springframework/cloud/kubernetes/examples/HelloController.java
 * @author gary
 * @since Dec 4, 2019 2:23:06 PM
 *
 */
@RestController
public class K8SController {

//	private static final Log log = LogFactory.getLog(K8SController.class);

	@Autowired
	private DiscoveryClient discoveryClient;

	@RequestMapping("/k8s/services")
	public List<String> services() {
		return this.discoveryClient.getServices();
	}
}
