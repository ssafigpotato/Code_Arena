package com.example.arena.domain.kurento.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddIceCandidateInputMessage {
    private UUID userId;
    private String sdp;
    private String sdpMid;
    private Integer sdpMLineIndex;
}
