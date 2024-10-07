package com.example.arena.domain.kurento.model;

import com.google.gson.JsonObject;
import lombok.Getter;
import org.kurento.client.*;
import org.kurento.jsonrpc.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.Closeable;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Getter
public class WebCamSession implements Closeable {

    private static final Logger log = LoggerFactory.getLogger(WebCamSession.class);
    private UUID userId;
    private String roomName;
    private UUID roomId;
    private final WebSocketSession webSocketSession;
    private final MediaPipeline mediaPipeline;
    private final WebRtcEndpoint outgoingMedia;
    private final ConcurrentHashMap<UUID, WebRtcEndpoint> incomingMedia = new ConcurrentHashMap<>();

    public WebCamSession(final UUID userId, final String roomName, final UUID roomId, final WebSocketSession webSocketSession, final MediaPipeline mediaPipeline) {
        this.userId = userId;
        this.roomName = roomName;
        this.roomId = roomId;
        this.webSocketSession = webSocketSession;
        this.mediaPipeline = mediaPipeline;
        this.outgoingMedia = new WebRtcEndpoint.Builder(mediaPipeline).build();
        this.outgoingMedia.addIceCandidateFoundListener(getEventListener(userId));
    }
    @Override
    public void close() throws IOException {
        for (final UUID participantId : incomingMedia.keySet()) {
            final WebRtcEndpoint ep = this.incomingMedia.get(participantId);
            ep.release();
        }
        outgoingMedia.release();
    }

    public void sendMessage(JsonObject message) throws IOException {
        synchronized (webSocketSession) {
            webSocketSession.sendMessage(new TextMessage(message.toString()));
        }
    }

    public void addCandidate(IceCandidate candidate, UUID userId) {
        if(userId.equals(this.userId)) {
            outgoingMedia.addIceCandidate(candidate);
        } else {
            WebRtcEndpoint webRtc = incomingMedia.get(userId);
            if(webRtc != null) {
                webRtc.addIceCandidate(candidate);
            }
        }
    }

    private WebRtcEndpoint getEndpointForUser(final WebCamSession sender) {
        if (sender.getUserId().equals(userId)) {
            return outgoingMedia;
        }

        WebRtcEndpoint incoming = incomingMedia.get(sender.getUserId());
        if (incoming == null) {
            incoming = new WebRtcEndpoint.Builder(mediaPipeline).build();
            incoming.addIceCandidateFoundListener(getEventListener(sender.getUserId()));
            incomingMedia.put(sender.getUserId(), incoming);
        }

        sender.getOutgoingMedia().connect(incoming);
        return incoming;
    }

    public void receiveVideoFrom(WebCamSession sender, String sdpOffer) throws IOException {
        final String ipSdpAnswer = this.getEndpointForUser(sender).processOffer(sdpOffer);
        final JsonObject scParams = new JsonObject();
        scParams.addProperty("id", "RECEIVE_VIDEO_ANSWER");
        scParams.addProperty("userId",sender.getUserId().toString() );
        scParams.addProperty("sdpAnswer", ipSdpAnswer);

        this.sendMessage(scParams);
        this.getEndpointForUser(sender).gatherCandidates();
    }


    public void cancelVideoFrom(WebCamSession session) {
        cancelVideoFrom(session.getUserId());
    }

    public void cancelVideoFrom(final UUID userId) {
        final WebRtcEndpoint incoming = incomingMedia.remove(userId);
        if (incoming != null) {
            incoming.release();
        }
    }


    public EventListener<IceCandidateFoundEvent> getEventListener(UUID senderId) {
        return new EventListener<IceCandidateFoundEvent>() {
            @Override
            public void onEvent(IceCandidateFoundEvent event) {
                JsonObject response = new JsonObject();
                response.addProperty("id", "iceCandidate");
                response.addProperty("userId", senderId.toString());
                response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
                try {
                    synchronized (webSocketSession) {
                        webSocketSession.sendMessage(new TextMessage(response.toString()));
                    }
                } catch (IOException e) {
                    // log.debug(e.getMessage());
                }
            }
        };
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || !(o instanceof WebCamSession)) return false;
        WebCamSession that = (WebCamSession) o;
        return Objects.equals(userId, that.userId) && Objects.equals(roomId, that.roomId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, roomId);
    }
}
