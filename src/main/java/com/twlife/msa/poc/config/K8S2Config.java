package com.twlife.msa.poc.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 1. org.springframework.context.annotation.Configuration.proxyBeanMethods()
 *
 * 指定是否應代理@Bean方法以強制執行bean生命週期行為，例如返回共享的單例bean實例，即使在用戶
 * 代碼中直接@Bean方法調用的情況下。此功能需要通過運行時生成的CGLIB子類來實現方法攔截，該子類
 * 具有一些限制，例如配置類及其方法不允許聲明為final。
 *
 * 默認值為true，允許在配置類中進行``bean間引用''以及對該配置的@Bean方法的外部調用。從另一個
 * 配置類。如果由於每個特定配置的@Bean方法都是自包含的並且被設計為供容器使用的普通工廠方法，則
 * 不需要這樣做，請將此標誌切換為false，以避免處理CGLIB子類。
 *
 * 關閉bean方法攔截可以有效地單獨處理@Bean方法，就像在非@Configuration類（也稱為 “ @Bean
 * Lite模式”）上聲明時一樣（請參閱@Bean的javadoc）。因此，從行為上講，它等效於刪除
 *
 * @Configuration 構造型。
 *
 * 2. org.springframework.boot.context.properties.ConfigurationProperties
 *
 * 外部化配置的註釋。 如果要綁定和驗證某些外部屬性（例如，來自.properties文件），請將其添加到
 * 類定義或@Configuration類中的@Bean方法。
 *
 * 綁定可以通過在帶註釋的類上調用setter來執行，或者，如果正在使用@ConstructorBinding，則可以
 * 通過綁定到構造函數參數來執行。
 *
 * 請注意，與@Value相反，由於屬性值已外部化，因此不對SpEL表達式進行求值。
 *
 * @author gary
 * @since Dec 4, 2019 2:05:48 PM
 */
@Configuration(proxyBeanMethods = false)
@ConfigurationProperties(prefix = "k8s2")
public class K8S2Config {

	private String property = "This is a default k8s2 property...";

	public String getProperty() {
		return this.property;
	}

	public void setProperty(String property) {
		this.property = property;
	}
}
