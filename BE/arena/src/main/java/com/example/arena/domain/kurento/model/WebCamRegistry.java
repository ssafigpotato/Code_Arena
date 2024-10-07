package com.example.arena.domain.kurento.model;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebCamRegistry {
    private final ConcurrentHashMap<UUID, WebCamSession> sessionByUserId = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, WebCamSession> sessionBySessionId = new ConcurrentHashMap<>();

    public void register(WebCamSession session) {
        sessionByUserId.put(session.getUserId(), session);
        sessionBySessionId.put(session.getWebSocketSession().getId(), session);
    }

    public WebCamSession getWebCamSessionByUserId(UUID userId) {
        return sessionByUserId.get(userId);
    }

    public WebCamSession getWebCamSessionBySessionId(WebSocketSession webSocketSession) {
        return sessionBySessionId.get(webSocketSession.getId());
    }

    public boolean isExist(UUID userId) {
        return sessionByUserId.containsKey(userId);
    }

    public WebCamSession removeWebCamSession(WebSocketSession webSocketSession) {
        final WebCamSession webCamSession = getWebCamSessionBySessionId(webSocketSession);
        sessionByUserId.remove(webCamSession.getUserId());
        sessionBySessionId.remove(webSocketSession.getId());
        return webCamSession;
    }
}
