package com.example.arena.domain.room.dto.request;

import com.example.arena.domain.room.entity.InterviewerType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.A;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EnterRoomRequest {
    private UUID roomId;
    private String password;
    private InterviewerType type;
}
