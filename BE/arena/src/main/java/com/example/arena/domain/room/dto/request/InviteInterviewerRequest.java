package com.example.arena.domain.room.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InviteInterviewerRequest {
    private UUID roomId;
    private UUID interviewerId;
}
