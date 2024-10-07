package com.example.arena.domain.room.dto.response;

import com.example.arena.domain.room.entity.RoomLanguage;
import com.example.arena.domain.room.entity.RoomStatus;
import com.example.arena.domain.room.entity.StartStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private UUID roomId;
    private String name;
    private String password;
    private RoomStatus status;
    private RoomLanguage roomLanguage;
    private Integer testTime;
    private Integer maxNum;
    private Integer curNum;
    private StartStatus startStatus;
    private RoomMemberResponse tester;
    private LocalDateTime startTime;
}
