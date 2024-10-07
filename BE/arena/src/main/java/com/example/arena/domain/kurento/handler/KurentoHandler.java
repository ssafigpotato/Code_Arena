package com.example.arena.domain.kurento.handler;

import com.example.arena.domain.kurento.model.WebCamRegistry;
import com.example.arena.domain.kurento.model.WebCamRoom;
import com.example.arena.domain.kurento.model.WebCamRoomManager;
import com.example.arena.domain.kurento.model.WebCamSession;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.kurento.client.IceCandidate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.UUID;

@Component
public class KurentoHandler extends TextWebSocketHandler {
    private static final Gson gson = new GsonBuilder().create();
    private WebCamRoomManager webCamRoomManager;
    private WebCamRegistry webCamRegistry;

    public KurentoHandler(WebCamRoomManager webCamRoomManager, WebCamRegistry webCamRegistry) {
        this.webCamRoomManager = webCamRoomManager;
        this.webCamRegistry = webCamRegistry;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        final JsonObject json = gson.fromJson(message.getPayload(), JsonObject.class);
        final WebCamSession user = webCamRegistry.getWebCamSessionBySessionId(session);

        switch(json.get("id").getAsString()) {
            case "join" -> joinRoom(json,session);
            case "leave" -> leaveRoom(user);
            case "onIceCandidate" -> {
                if(user != null) {
                    IceCandidate iceCandidate = jsonToIceCandidate(json.get("candidate").getAsJsonObject());
                    user.addCandidate(iceCandidate,UUID.fromString(json.get("name").getAsString()));
                }
            }
            case "receive" -> {
                final UUID userId = UUID.fromString(json.get("sender").getAsString());
                final WebCamSession sender = webCamRegistry.getWebCamSessionByUserId(userId);
                final String sdpOffer = json.get("sdpOffer").getAsString();
                user.receiveVideoFrom(sender, sdpOffer);
            }
        }
    }

    private IceCandidate jsonToIceCandidate(JsonObject json) {
        return new IceCandidate(
                json.get("candidate").getAsString(),
                json.get("sdpMid").getAsString(),
                json.get("sdpMLineIndex").getAsInt());
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        WebCamSession user = webCamRegistry.removeWebCamSession(session);
        webCamRoomManager.getRoom(user.getRoomName()).leaveRoom(user);
    }

    private void joinRoom(JsonObject params, WebSocketSession session) throws IOException {
        final String roomName = params.get("room").getAsString();
        final UUID userId = UUID.fromString(params.get("user").getAsString());

        WebCamRoom room = webCamRoomManager.getRoom(roomName);
        final WebCamSession user = room.joinRoom(userId,session);
        webCamRegistry.register(user);
    }

    private void leaveRoom(WebCamSession webCamSession) throws IOException {
        final WebCamRoom webCamRoom = webCamRoomManager.getRoom(webCamSession.getRoomName());
        webCamRoom.leaveRoom(webCamSession);

        if(webCamRoom.getParticipants().isEmpty()) {
            webCamRoomManager.removeRoom(webCamRoom);
        }
    }
}
