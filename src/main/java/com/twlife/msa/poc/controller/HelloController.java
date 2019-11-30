package com.twlife.msa.poc.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller 1
 *
 * @author gary <Desp.Liu@taiwanlife.com>
 * @since Nov 22, 2019 11:29:01 AM
 *
 */
@RestController
public class HelloController {

	@GetMapping("/hello/{username}")
	public ResponseEntity<String>hello(@PathVariable("username") String username) {
		return ResponseEntity.ok(username);
	}

}
