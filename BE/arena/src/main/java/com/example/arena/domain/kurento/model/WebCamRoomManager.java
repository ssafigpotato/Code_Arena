package com.example.arena.domain.kurento.model;

import org.kurento.client.KurentoClient;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebCamRoomManager {

    private KurentoClient kurentoClient;

    private final ConcurrentHashMap<String, WebCamRoom> rooms = new ConcurrentHashMap<>();

    public WebCamRoomManager(KurentoClient kurentoClient) {
        this.kurentoClient = kurentoClient;
    }

    public WebCamRoom getRoom(String roomName) {
        WebCamRoom room = rooms.get(roomName);

        if(room == null) {
            WebCamRoom newRoom = new WebCamRoom(
                    kurentoClient.createMediaPipeline(),
                    roomName
            );

            rooms.put(roomName,newRoom);

            return newRoom;
        }

        return room;
    }

    public void removeRoom(WebCamRoom room) throws IOException {
        rooms.remove(room.getRoomName());
        room.close();
    }
}
