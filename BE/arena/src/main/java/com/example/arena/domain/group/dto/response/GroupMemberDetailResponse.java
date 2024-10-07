package com.example.arena.domain.group.dto.response;

import com.example.arena.domain.group.entity.GroupInviteCode;
import com.example.arena.domain.group.entity.GroupMemberType;
import com.example.arena.domain.member.dto.response.MemberResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberDetailResponse {
    private UUID groupId;
    private Integer meetingTime;
    private GroupInviteCode inviteCode;
    private GroupMemberType type;
    private MemberResponse memberResponse;
}
