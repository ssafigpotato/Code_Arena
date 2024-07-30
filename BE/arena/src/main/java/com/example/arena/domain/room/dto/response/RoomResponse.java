package com.example.arena.domain.room.dto.response;

import com.example.arena.domain.room.entity.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private UUID roomId;
    private String name;
    private String password;
    private RoomStatus status;
}
