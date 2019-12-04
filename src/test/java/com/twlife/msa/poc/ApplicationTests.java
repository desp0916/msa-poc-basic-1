package com.twlife.msa.poc;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
class ApplicationTests {

	@Autowired
	private ApplicationContext context;

	/*
	 * This test proves that the application can be loaded successful and that
	 * all @configurations and dependencies are there
	 */
	@Test
	public void contextLoads() throws Exception {
		assertThat(this.context).isNotNull();
	}

}
