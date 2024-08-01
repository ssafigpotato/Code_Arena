package com.example.arena.domain.group.dto.response;

import com.example.arena.domain.member.dto.response.MemberResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GroupDetailResponse {
    private GroupResponse groupResponse;
    private List<GroupMemberDetailResponse> groupMembers;
}
