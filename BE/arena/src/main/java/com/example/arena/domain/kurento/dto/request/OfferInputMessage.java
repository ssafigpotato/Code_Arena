package com.example.arena.domain.kurento.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OfferInputMessage {
    private UUID userId;
    private String sdp;
}
