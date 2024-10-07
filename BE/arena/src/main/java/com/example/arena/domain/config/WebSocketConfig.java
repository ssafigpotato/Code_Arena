package com.example.arena.domain.config;

import com.example.arena.domain.kurento.handler.KurentoHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final KurentoHandler kurentoHandler;

    public WebSocketConfig(KurentoHandler kurentoHandler) {
        this.kurentoHandler = kurentoHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(kurentoHandler, "/api/v1/groupCall").setAllowedOrigins("*");
    }
}
