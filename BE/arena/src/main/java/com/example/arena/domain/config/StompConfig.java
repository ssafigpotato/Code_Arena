package com.example.arena.domain.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class StompConfig implements WebSocketMessageBrokerConfigurer {

	@Value("${spring.rabbitmq.host}")
	private String host;

	@Value("${spring.rabbitmq.username}")
	private String userName;

	@Value("${spring.rabbitmq.password}")
	private String password;

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/rabbitmq/ws").setAllowedOriginPatterns("*").withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
//            registry.setPathMatcher(new AntPathMatcher(".")); // 구분자 . 으로 설정

		registry.enableStompBrokerRelay("/topic", "/queue", "/exchange", "/amq/queue") // stomp 내장 기능 사용
				.setRelayHost(host).setRelayPort(8613)
				.setSystemLogin(userName).setSystemPasscode(password)
				.setClientLogin(userName).setClientPasscode(password);

		registry.setApplicationDestinationPrefixes("/app");
	}
}
