package com.example.arena.domain.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

	@Bean
	public WebMvcConfigurer corsConfigurer() {

		String[] allowedOrigins = { "http://localhost:5500", "http://localhost:3000","http://localhost:3001", "http://127.0.0.1:5500",
				"http://127.0.0.1:3000", "https://i11a807.p.ssafy.io" };

		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOriginPatterns(allowedOrigins) // 여기에 특정 도메인을 명시적으로 설정합니다.
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowCredentials(true)
//						.allowedHeaders("access", "refresh")
						.exposedHeaders("access", "refresh");
			}
		};
	}
}
