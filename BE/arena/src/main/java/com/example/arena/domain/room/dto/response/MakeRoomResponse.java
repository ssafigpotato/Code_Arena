package com.example.arena.domain.room.dto.response;

import com.example.arena.domain.room.entity.RoomLanguage;
import com.example.arena.domain.room.entity.RoomStatus;
import com.example.arena.domain.room.entity.StartStatus;
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
    private RoomMemberResponse tester;
    private RoomStatus status;
    private RoomLanguage roomLanguage;
    private Integer testTime;
    private Integer maxNum;
    private Integer curNum;
    private StartStatus startStatus;
}
