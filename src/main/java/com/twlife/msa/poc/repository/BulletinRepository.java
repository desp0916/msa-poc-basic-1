package com.twlife.msa.poc.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;

import com.twlife.msa.poc.entity.Bulletin;

/**
 * <p>佈告</p>
 *
 * <pre>
 *   curl -X POST  -H "Content-Type:application/json" http://localhost:8082/api/bulletins/ -d '{"subject": "test subject", "content": "test content..."}'
 * </pre>
 *
 * @author gary
 * @since Dec 2, 2019 11:11:06 AM
 */
@Transactional
@RepositoryRestResource(collectionResourceRel = "bulletins", path = "bulletins")
public interface BulletinRepository  extends BaseRepository<Bulletin, Long> {
	/**
	 * <p>檢視單篇佈告（不需要限制權限）</p>
	 */
	@Override
	@Query(value = "SELECT b FROM Bulletin b WHERE b.dataStatus = 1 AND b.id = :id",
			nativeQuery = false)
	Bulletin findOne(@Param("id") Long id);

	@Modifying
	@Query(value="UPDATE Bulletin b SET b.dataStatus = 0, b.version = b.version + 1, "
			+ "b.updatedDate = CURRENT_TIMESTAMP WHERE b = ?1")
	@Override
	void delete(Bulletin article);
}
