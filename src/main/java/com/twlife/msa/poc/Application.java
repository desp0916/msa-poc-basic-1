package com.twlife.msa.poc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
* Spring Boot Application
*
* @author gary <Desp.Liu@taiwanlife.com>
* @since Nov 22, 2019 11:29:01 AM
*
*/
@SpringBootApplication
@EnableAutoConfiguration
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
