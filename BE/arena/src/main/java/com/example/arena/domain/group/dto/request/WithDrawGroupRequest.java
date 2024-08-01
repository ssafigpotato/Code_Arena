package com.example.arena.domain.group.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WithDrawGroupRequest {
    private UUID groupId;
    private UUID memberId;
}
