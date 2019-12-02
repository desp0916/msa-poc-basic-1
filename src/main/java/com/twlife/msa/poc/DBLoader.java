package com.twlife.msa.poc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.twlife.msa.poc.entity.Article;
import com.twlife.msa.poc.repository.ArticleRepository;

/**
 * Spring Boot Application 啟動後會執行的 DB 操作
 *
 * @author gary <Desp.Liu@taiwanlife.com>
 * @since Nov 22, 2019 11:56:34 AM
 *
 */
@Component
@Transactional
public class DBLoader implements CommandLineRunner {

	@Autowired
	private ArticleRepository articles;

	@Override
	public void run(String... args) throws Exception {
		if (true) {
			return;
		}
		this.articles.save(new Article("subject", "content"));
	}

}
