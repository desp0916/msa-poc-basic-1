package com.twlife.msa.poc.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.rest.core.annotation.Description;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * 文章
 *
 * @author gary <Desp.Liu@taiwanlife.com>
 * @since Nov 22, 2019 11:59:13 AM
 *
 */
@Entity
@Table(name = "article")
public class Article {

	/**
	 * 文章 ID（流水號）
	 */
	@Id
	@Description("報表排程任務ID")
	@NotNull(message = "article.id.empty.Article.id")
	@GenericGenerator(
	        name = "articleIdSequenceGenerator",
	        strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
	        parameters = {
	                @Parameter(name = "sequence_name", value = "article_id_seq"),
	                @Parameter(name = "initial_value", value = "1"),
	                @Parameter(name = "increment_size", value = "1")
	        }
	)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "articleIdSequenceGenerator")
	@Column(name = "article_id", unique = true, updatable = false, nullable = false)
	private Long id;

	/**
	 * 主旨
	 */
	@Description("主旨")
	@NotNull(message = "article.subject.empty.Article.subject")
	@Column(name = "subject", length = 150, nullable = false)
	private String subject;

	/**
	 * 文章內容 (最多 4096 個字元)
	 */
	@Description("作業內容 (最多 4096 個字元)")
	@Lob
	@NotNull(message = "article.content.empty.Article.content")
	@Column(name="content", nullable = false, length = 4096)
	private String content;

	/**
	 * 資料狀態
	 *  -1: 永久刪除 (不可使用)
	 *   0: 暫時停用
	 *   1: 正常使用中
	 */
	@Description("資料狀態")
//	@NotNull(message = "article.dataStatus.empty.Article.dataStatus")
	@ColumnDefault("1")
	@Column(name = "data_status", nullable = false)
	private Integer dataStatus;

	/**
	 * 資料建立日期
	 */
	@Description("資料建立日期")
	@NotNull(message = "article.createdDate.empty.Article.createdDate")
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_date", columnDefinition = "timestamp with time zone not null",
		nullable = false, updatable = false)
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Taipei")
	@CreatedDate
	private Date createdDate;

	/**
	 * 資料異動日期
	 */
	@Description("資料異動日期")
	@Temporal(TemporalType.TIMESTAMP)
	@Column(columnDefinition =  "timestamp with time zone not null")
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Taipei")
	@LastModifiedDate
	private Date updatedDate;

	/**
	 * 版本
	 */
	@Description("版本")
	@Version
	@JsonIgnore
	@ColumnDefault("0")
	private Long version;

	public Article() {}

	/**
	 * 文章基本資料
	 *
	 * @param subject
	 * @param content
	 * @param dataStatus
	 */
	public Article(String subject, String content) {
		this.subject = subject;
		this.content = content;
	}

	/**
	 * 資料持久化前：
	 *
	 * 1. 自動產生「資料建立日期」與「資料異動日期」
	 * 2. 將 dataStatus 設為 1
	 * 3. 將 version 設為 0
	 */
	@PrePersist
	private void onCreate() {
		createdDate = updatedDate = new Date();
		dataStatus = 1;
		version = 0L;
	}

	/**
	 * 資料更新前，自動產生資料異動日期
	 */
	@PreUpdate
	private void onUpdate() {
		updatedDate = new Date();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getDataStatus() {
		return dataStatus;
	}

	public void setDataStatus(Integer dataStatus) {
		this.dataStatus = dataStatus;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((content == null) ? 0 : content.hashCode());
		result = prime * result + ((createdDate == null) ? 0 : createdDate.hashCode());
		result = prime * result + ((dataStatus == null) ? 0 : dataStatus.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((subject == null) ? 0 : subject.hashCode());
		result = prime * result + ((updatedDate == null) ? 0 : updatedDate.hashCode());
		result = prime * result + ((version == null) ? 0 : version.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Article other = (Article) obj;
		if (content == null) {
			if (other.content != null)
				return false;
		} else if (!content.equals(other.content))
			return false;
		if (createdDate == null) {
			if (other.createdDate != null)
				return false;
		} else if (!createdDate.equals(other.createdDate))
			return false;
		if (dataStatus == null) {
			if (other.dataStatus != null)
				return false;
		} else if (!dataStatus.equals(other.dataStatus))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (subject == null) {
			if (other.subject != null)
				return false;
		} else if (!subject.equals(other.subject))
			return false;
		if (updatedDate == null) {
			if (other.updatedDate != null)
				return false;
		} else if (!updatedDate.equals(other.updatedDate))
			return false;
		if (version == null) {
			if (other.version != null)
				return false;
		} else if (!version.equals(other.version))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Article [id=" + id + ", subject=" + subject + ", content=" + content + ", dataStatus=" + dataStatus
				+ ", createdDate=" + createdDate + ", updatedDate=" + updatedDate + ", version=" + version + "]";
	}

}
