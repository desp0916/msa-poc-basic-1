package com.twlife.msa.poc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author gary
 * @since Nov 30, 2019 11:34:30 PM
 *
 */
@Controller
public class HomeController {
	/**
	 * <p>主頁面</p>
	 *
	 * @return
	 */
	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}
}
