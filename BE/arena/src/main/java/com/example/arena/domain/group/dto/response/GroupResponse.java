package com.example.arena.domain.group.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.A;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GroupResponse {
    private UUID groupId;
    private String groupName;
    private UUID leaderId;
}
