package com.example.arena.domain.room.dto.response;

import com.example.arena.domain.room.entity.InterviewerType;
import com.example.arena.domain.room.entity.RoomMemberStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomMemberResponse {
    private UUID memberId;
    private InterviewerType interviewerType;
    private RoomMemberStatus status;
}
