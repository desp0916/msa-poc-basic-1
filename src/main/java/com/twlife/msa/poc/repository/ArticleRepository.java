package com.twlife.msa.poc.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;

import com.twlife.msa.poc.entity.Article;

/**
 * <p>文章</p>
 *
 * <pre>
 *   curl -X POST  -H "Content-Type:application/json" http://localhost:8082/api/articles/ -d '{"subject": "test subject", "content": "test content..."}'
 * </pre>
 *
 * @author gary <Desp.Liu@taiwanlife.com>
 * @since Nov 22, 2019 1:20:11 PM
 *
 */
@Transactional
@RepositoryRestResource(collectionResourceRel = "articles", path = "articles")
public interface ArticleRepository extends BaseRepository<Article, Long> {

	/**
	 * <p>檢視單篇文章（不需要限制權限）</p>
	 */
	@Override
	@Query(value = "SELECT a FROM Article a WHERE a.dataStatus = 1 AND a.id = :id",
			nativeQuery = false)
	Article findOne(@Param("id") Long id);

	@Modifying
	@Query(value="UPDATE Article a SET a.dataStatus = 0, a.version = a.version + 1, "
			+ "a.updatedDate = CURRENT_TIMESTAMP WHERE a = ?1")
	@Override
	void delete(Article article);
}
