package com.twlife.msa.poc.repository;

import static com.twlife.msa.poc.Constants.DATETIME_COLUMN_SHORT_PATTERN;
import static com.twlife.msa.poc.Constants.DATETIME_COLUMN_TIMEZONE;

import java.util.Date;

import org.springframework.data.rest.core.config.Projection;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.twlife.msa.poc.entity.Article;

/**
 *
 * @author gary
 * @since Dec 2, 2019 5:25:18 PM
 *
 */
@Projection(name = "articleInlineProjection", types = { Article.class })
public interface ArticleInlineProjection {

	// 在 UI 清單要用到的才寫在這裡（Entity 也要有對應的 method）：
	String getId();
	String getSubject();
	String getContent();

	Date getCreatedDate();	// 資料建立日期

	@JsonFormat(pattern=DATETIME_COLUMN_SHORT_PATTERN, timezone=DATETIME_COLUMN_TIMEZONE)
	Date getShortCreatedDate();	// 資料建立日期

	Date getUpdatedDate();	// 資料建立日期

	@JsonFormat(pattern=DATETIME_COLUMN_SHORT_PATTERN, timezone=DATETIME_COLUMN_TIMEZONE)
	Date getShortUpdatedDate();	// 資料異動日期
}
