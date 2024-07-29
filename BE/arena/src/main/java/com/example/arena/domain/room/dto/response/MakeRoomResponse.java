package com.example.arena.domain.room.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MakeRoomResponse {
    private UUID roomId;
    private String roomName;
    private String password;
    private UUID testerId;
}
