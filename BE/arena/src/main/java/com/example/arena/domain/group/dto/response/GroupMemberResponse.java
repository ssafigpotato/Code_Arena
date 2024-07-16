package com.example.arena.domain.group.dto.response;

import com.example.arena.domain.group.entity.GroupInviteCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberResponse {
    private UUID groupId;
    private UUID memberId;
    private GroupInviteCode inviteCode;
}
