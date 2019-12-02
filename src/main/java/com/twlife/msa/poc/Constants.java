package com.twlife.msa.poc;

/**
 *
 * @author gary
 * @since Dec 2, 2019 5:25:59 PM
 *
 */
public class Constants {
	// Entity 中 createdDate 和 updateDate 欄位使用
	public static final String DATETIME_COLUMN_TIMEZONE = "Asia/Taipei";
	public static final String DATETIME_COLUMN_PATTERN = "yyyy-MM-dd HH:mm:ss";
	public static final String DATETIME_COLUMN_SHORT_PATTERN = "yyyy-MM-dd";
	public static final String DATETIME_COLUMN_LOCALE = "zh_TW";

	public static final String DATETIME_COLUMN_DEFINITION_CREATED_DATE = "timestamp with time zone not null";
	public static final String DATETIME_COLUMN_DEFINITION_UPDATED_DATE = "timestamp with time zone";
}
