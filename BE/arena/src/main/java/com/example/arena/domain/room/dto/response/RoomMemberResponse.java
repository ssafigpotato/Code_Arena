package com.example.arena.domain.room.dto.response;

import com.example.arena.domain.room.entity.InterviewerType;
import com.example.arena.domain.room.entity.RoomLanguage;
import com.example.arena.domain.room.entity.RoomMemberStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomMemberResponse {
    private UUID roomMemberId;
    private UUID roomId;
    private UUID memberId;
    private String nickName;
    private InterviewerType interviewerType;
    private RoomMemberStatus status;
    private RoomLanguage roomLanguage;
    private Integer testTime;
}
