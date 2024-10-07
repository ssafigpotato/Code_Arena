package com.example.arena.domain.kurento.model;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import jakarta.annotation.PreDestroy;
import lombok.Getter;
import org.kurento.client.MediaPipeline;
import org.springframework.web.socket.WebSocketSession;

import java.io.Closeable;
import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Getter
public class WebCamRoom implements Closeable {

    private final ConcurrentHashMap<UUID, WebCamSession> participants = new ConcurrentHashMap<>();
    private final UUID roomId = UUID.randomUUID();
    private final MediaPipeline pipeline;
    private final String roomName;

    public WebCamRoom(MediaPipeline pipeline, String roomName) {
        this.pipeline = pipeline;
        this.roomName = roomName;
    }

    private WebCamSession makeWebCamSession(UUID userId, WebSocketSession session) {
        return new WebCamSession(
                userId,
                roomName,
                roomId,
                session,
                pipeline
        );
    }

    public void leaveRoom(WebCamSession webCamSession) throws IOException {
        removeWebCamSession(webCamSession.getUserId());
        webCamSession.close();
    }

    private void removeWebCamSession(UUID userId) throws IOException {
        participants.remove(userId);

        final JsonObject participantLeftJson = new JsonObject();
        participantLeftJson.addProperty("id", "LEFT_PARTICIPANT");
        participantLeftJson.addProperty("userId", userId.toString());

        for (final WebCamSession participant : participants.values()) {
            participant.cancelVideoFrom(userId);
            participant.sendMessage(participantLeftJson);
        }

    }


    public WebCamSession joinRoom(UUID userId, WebSocketSession webSocketSession) throws IOException {
        final WebCamSession participant = makeWebCamSession(userId, webSocketSession);
        sendJoinMessage(participant);
        participants.put(participant.getUserId(), participant);
        sendParticipantsMessage(participant);

        return participant;
    }

    public void sendParticipantsMessage(WebCamSession curUser) throws IOException {
        final JsonArray jsonArray = new JsonArray();

        for (final WebCamSession webCamSession : participants.values()) {
            if (!webCamSession.equals(curUser)) {
                final JsonElement participantId = new JsonPrimitive(webCamSession.getUserId().toString());
                jsonArray.add(participantId);
            }
        }

        final JsonObject existWebCanSessionMessage = new JsonObject();
        existWebCanSessionMessage.addProperty("id", "EXIST_PARTICIPANT");
        existWebCanSessionMessage.add("data", jsonArray);

        curUser.sendMessage(existWebCanSessionMessage);
    }

    private void sendJoinMessage(WebCamSession participant) throws IOException {
        final JsonObject participantMessage = new JsonObject();
        participantMessage.addProperty("id", "NEW_PARTICIPANT_ARRIVED");
        participantMessage.addProperty("userId", participant.getUserId().toString());

        for (final WebCamSession session : participants.values()) {
            session.sendMessage(participantMessage);
        }
    }

    @PreDestroy
    private void shutDown() throws IOException {
        this.close();
    }

    @Override
    public void close() throws IOException {
        for (final WebCamSession session : participants.values()) {
            session.close();
        }
        participants.clear();
        pipeline.release();
    }
}
