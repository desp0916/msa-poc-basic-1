package com.twlife.msa.poc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * https://blog.csdn.net/isea533/article/details/50412212
 *
 * @author gary
 * @since Dec 21, 2019 9:05:45 PM
 *
 */
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer{
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/js/**")
	            .addResourceLocations("classpath:/js/");
	}
}
