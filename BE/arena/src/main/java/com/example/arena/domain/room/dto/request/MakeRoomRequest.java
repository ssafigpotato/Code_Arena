package com.example.arena.domain.room.dto.request;

import com.example.arena.domain.room.entity.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MakeRoomRequest {
    private String roomName;
    private RoomStatus roomStatus;
    private String password;
}
