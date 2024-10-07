package com.example.arena.domain.config;


import com.example.arena.domain.member.jwt.CustomLogoutFilter;
import com.example.arena.domain.member.jwt.JWTFilter;
import com.example.arena.domain.member.jwt.JWTUtil;
import com.example.arena.domain.member.jwt.LoginFilter;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.member.repository.RefreshTokenRedisRepository;
import com.example.arena.domain.member.repository.RefreshTokenRepository;
import com.example.arena.domain.member.service.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.authentication.configuration.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	// AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
	private final AuthenticationConfiguration authenticationConfiguration;
	private final JWTUtil jwtUtil;
//    private final RefreshTokenRepository refreshRepository;
    private final ObjectMapper objectMapper;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final MemberRepository memberRepository;
	private final CustomUserDetailsService customUserDetailsService;
	private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
	private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, CustomUserDetailsService customUserDetailsService, JWTUtil jwtUtil, ObjectMapper objectMapper, RefreshTokenRedisRepository refreshTokenRedisRepository, MemberRepository memberRepository, AuthenticationManagerBuilder authenticationManagerBuilder) {

        this.authenticationConfiguration = authenticationConfiguration;
		this.customUserDetailsService = customUserDetailsService;
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
        this.refreshTokenRedisRepository = refreshTokenRedisRepository;
        this.memberRepository = memberRepository;
		this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

	// AuthenticationManager Bean 등록
//	@Bean
//	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
//		List<GlobalAuthenticationConfigurerAdapter> configurerAdapterList = new ArrayList<>();
//		GlobalAuthenticationConfigurerAdapter globalAuthenticationConfigurerAdapter = new GlobalAuthenticationConfigurerAdapter() {
//			@Override
//			public void configure(AuthenticationManagerBuilder auth) throws Exception {
//				auth.userDetailsService(customUserDetailsService);
//				super.configure(auth);
//			}
//		};
//		return configuration.getAuthenticationManager();
//	}

	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(customUserDetailsService);
		authProvider.setPasswordEncoder(bCryptPasswordEncoder);
		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		authenticationManagerBuilder.authenticationProvider(authenticationProvider());
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		String[] requestMatcherPatterns = {
				"/swagger-ui/**",
				"/v3/api-docs/**",

				"/api/v1/login",
				"/",
				"/api/v1/member/signup",

				"/api/v1/arena/**",
				"/api/v1/board/**",
				"/api/v1/comment/**",
				"/api/v1/code/**",
				"/api/v1/editor/**",
				"/api/v1/rabbitmq/**",
				"/api/v1/group/**",
				"/api/v1/groupCall",
				"/api/v1/room/**",
				"/api/v1/report/**",
				"/rabbitmq/**"
		};

		// csrf disable
		http.csrf((auth) -> auth.disable());
		http.cors(Customizer.withDefaults());
		// from 로그인 방식 disable
		http.formLogin((auth) -> auth.disable());

        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil,objectMapper,refreshTokenRedisRepository,memberRepository), UsernamePasswordAuthenticationFilter.class);
        http
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshTokenRedisRepository), LogoutFilter.class);

		http.authorizeHttpRequests((auth) -> auth
				.requestMatchers(requestMatcherPatterns).permitAll()
				.requestMatchers("/admin").hasRole("ADMIN").anyRequest().authenticated());

		http.addFilterBefore(new JWTFilter(jwtUtil, memberRepository, objectMapper), LoginFilter.class);

		http.addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, objectMapper,
				refreshTokenRedisRepository, memberRepository), UsernamePasswordAuthenticationFilter.class);
		http.addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshTokenRedisRepository), LogoutFilter.class);

		// 세션 설정
		http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}
}
