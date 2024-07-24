package com.example.arena.domain.config;

import lombok.RequiredArgsConstructor;
import org.kurento.client.KurentoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@RequiredArgsConstructor
@Configuration
public class KurentoClientConfig {
    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create();
    }
}
