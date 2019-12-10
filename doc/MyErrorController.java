package com.twlife.msa.poc.controller;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * https://www.baeldung.com/spring-boot-custom-error-page
 *
 * @author gary
 * @since Dec 7, 2019 3:01:50 PM
 *
 */
@Controller
public class MyErrorController implements ErrorController {

	private static final Log log = LogFactory.getLog(MyErrorController.class);

	@RequestMapping("/error")
	public String handleError(HttpServletRequest request) {
		// do something like logging
		log.error("Error happened!");
		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		if (status != null) {
			Integer statusCode = Integer.valueOf(status.toString());
			if (statusCode == HttpStatus.NOT_FOUND.value()) {
				return "error-404";
			} else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
				return "error-500";
			}
		}
		return "error";
	}

	@Override
	public String getErrorPath() {
		return "/error";
	}
}