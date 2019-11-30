package com.twlife.msa.poc.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller 1
 *
 * @author gary <Desp.Liu@taiwanlife.com>
 * @since Nov 22, 2019 11:29:01 AM
 *
 */
@RestController
public class Controller {

	@RequestMapping("/")
	String home() {
		return "Hello World!";
	}

}
