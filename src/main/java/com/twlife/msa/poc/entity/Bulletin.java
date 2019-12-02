package com.twlife.msa.poc.entity;

import static com.twlife.msa.poc.Constants.DATETIME_COLUMN_DEFINITION_CREATED_DATE;
import static com.twlife.msa.poc.Constants.DATETIME_COLUMN_DEFINITION_UPDATED_DATE;
import static com.twlife.msa.poc.Constants.DATETIME_COLUMN_PATTERN;
import static com.twlife.msa.poc.Constants.DATETIME_COLUMN_TIMEZONE;

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
 * Bulletin.java
 *
 * 系統作業佈告欄
 *
 * 用來維護佈告欄資料
 *
 * @author gary <Desp.Liu@taiwanlife.com>
 * @since  2017年3月7日 下午12:51:56
 */
@Entity
@Table(name = "bulletin")
public class Bulletin {

	/**
	 * 佈告ID（流水號）
	 */
	@Id
	@Description("佈告ID")
	@NotNull(message = "bulletin.id.empty.Bulletin.id")
//	@SequenceGenerator(name = "pk_sequence", sequenceName = "bas_bulletin_id_seq", allocationSize = 1)
//	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pk_sequence")
	@GenericGenerator(
	        name = "bulletinIdSequenceGenerator",
	        strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
	        parameters = {
	                @Parameter(name = "sequence_name", value = "bas_bulletin_id_seq"),
	                @Parameter(name = "initial_value", value = "1"),
	                @Parameter(name = "increment_size", value = "1")
	        }
	)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bulletinIdSequenceGenerator")
	@Column(name = "bulletin_id", unique = true, updatable = false, nullable = false)
	private Long id;

	/**
	 * 主旨
	 */
	@Description("主旨")
	@NotNull(message = "bulletin.subject.empty.Bulletin.subject")
	@Column(name = "subject", length = 150, nullable = false)
	private String subject;

	/**
	 * 作業時段 - 開始時間
	 */
	@Description("作業時段 - 開始時間")
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="start_time", columnDefinition = DATETIME_COLUMN_DEFINITION_CREATED_DATE)
	@JsonFormat(pattern=DATETIME_COLUMN_PATTERN, timezone=DATETIME_COLUMN_TIMEZONE)
	private Date startTime;

	/**
	 * 作業時段 - 結束時間
	 */
	@Description("作業時段 - 結束時間")
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="end_time", columnDefinition = DATETIME_COLUMN_DEFINITION_CREATED_DATE)
	@JsonFormat(pattern=DATETIME_COLUMN_PATTERN, timezone=DATETIME_COLUMN_TIMEZONE)
	private Date endTime;

	/**
	 * 作業內容 (最多 4096 個字元)
	 */
	@Description("作業內容 (最多 4096 個字元)")
	@Lob
	@NotNull(message = "bulletin.content.empty.Bulletin.content")
	@Column(name="content", nullable = false, length = 4096)
	private String content;

	/**
	 * 作業影響範圍 (最多 1024 個字元)
	 */
	@Description("作業影響範圍 (最多 1024 個字元)")
	@Column(name="impact", length = 1024)
	private String impact;

	/**
	 * 聯絡資訊 (最多 1024 個字元)
	 */
	@Description("聯絡資訊 (最多 1024 個字元)")
	@Column(name="contact_info", length = 1024)
	private String contactInfo;

	/**
	 * 資料狀態
	 *  -1: 永久刪除 (不可使用)
	 *   0: 暫時停用
	 *   1: 正常使用中
	 */
	@Description("資料狀態")
	@NotNull(message = "bulletin.dataStatus.empty.Bulletin.dataStatus")
	@ColumnDefault("1")
	@Column(name = "data_status", nullable = false)
	private Integer dataStatus;

	/**
	 * 資料建立日期
	 */
	@Description("資料建立日期")
	@NotNull(message = "bulletin.createdDate.empty.Bulletin.createdDate")
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_date", columnDefinition = DATETIME_COLUMN_DEFINITION_CREATED_DATE,
	nullable = false, updatable = false)
	@JsonFormat(pattern = DATETIME_COLUMN_PATTERN, timezone = DATETIME_COLUMN_TIMEZONE)
	@CreatedDate
	private Date createdDate;

	/**
	 * 資料異動日期
	 */
	@Description("資料異動日期")
	@Temporal(TemporalType.TIMESTAMP)
	@Column(columnDefinition = DATETIME_COLUMN_DEFINITION_UPDATED_DATE)
	@JsonFormat(pattern=DATETIME_COLUMN_PATTERN, timezone=DATETIME_COLUMN_TIMEZONE)
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

	public Bulletin() {
	}

	/**
	 * 佈告欄基本資料
	 *
	 * @param subject 主旨（不可為 NULL）
	 * @param startTime 作業時段 - 開始時間（可為 NULL）
	 * @param endTime 作業時段 - 結束時間（可為 NULL）
	 * @param content 作業內容 (最多 4096 個字元)（不可為 NULL）
	 * @param impact 作業影響範圍 (最多 1024 個字元)（可為 NULL）
	 */
	public Bulletin(String subject, Date startTime, Date endTime, String content, String impact,
			String contactInfo) {
		this.subject = subject;
		this.startTime = startTime;
		this.endTime = endTime;
		this.content = content;
		this.impact = impact;
		this.contactInfo = contactInfo;
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
		createdDate = new Date();
		updatedDate = new Date();
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

	/**
	 * 取得「作業時段 - 開始時間」（用於 Inline Projection）
	 * @JsonFormat(pattern="yyyy-MM-dd HH:mm" timezone="Asia/Taipei")
	 */
	public Date getShortStartTime() {
		return startTime;
	}

	/**
	 * 取得「作業時段 - 結束時間」（用於 Inline Projection）
	 * @JsonFormat(pattern="yyyy-MM-dd HH:mm" timezone="Asia/Taipei")
	 */
	public Date getShortEndTime() {
		return endTime;
	}

	/**
	 * 取得「資料建立日期」（用於 Inline Projection）
	 * @JsonFormat(pattern="yyyy-MM-dd")
	 */
	public Date getShortCreatedDate() {
		return createdDate;
	}

	/**
	 * 取得「資料異動日期」（用於 Inline Projection）
	 * @JsonFormat(pattern="yyyy-MM-dd")
	 */
	public Date getShortUpdatedDate() {
		return updatedDate;
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

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getImpact() {
		return impact;
	}

	public void setImpact(String impact) {
		this.impact = impact;
	}

	public String getContactInfo() {
		return contactInfo;
	}

	public void setContactInfo(String contactInfo) {
		this.contactInfo = contactInfo;
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
		result = prime * result + ((contactInfo == null) ? 0 : contactInfo.hashCode());
		result = prime * result + ((content == null) ? 0 : content.hashCode());
		result = prime * result + ((createdDate == null) ? 0 : createdDate.hashCode());
		result = prime * result + ((dataStatus == null) ? 0 : dataStatus.hashCode());
		result = prime * result + ((endTime == null) ? 0 : endTime.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((impact == null) ? 0 : impact.hashCode());
		result = prime * result + ((startTime == null) ? 0 : startTime.hashCode());
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
		Bulletin other = (Bulletin) obj;
		if (contactInfo == null) {
			if (other.contactInfo != null)
				return false;
		} else if (!contactInfo.equals(other.contactInfo))
			return false;
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
		if (endTime == null) {
			if (other.endTime != null)
				return false;
		} else if (!endTime.equals(other.endTime))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (impact == null) {
			if (other.impact != null)
				return false;
		} else if (!impact.equals(other.impact))
			return false;
		if (startTime == null) {
			if (other.startTime != null)
				return false;
		} else if (!startTime.equals(other.startTime))
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
		return "Bulletin [id=" + id + ", subject=" + subject + ", startTime=" + startTime + ", endTime=" + endTime
				+ ", content=" + content + ", impact=" + impact + ", contactInfo=" + contactInfo + ", dataStatus="
				+ dataStatus + ", createdDate=" + createdDate + ", updater=" + ", updatedDate=" + updatedDate +
				", version=" + version + "]";
	}

}
