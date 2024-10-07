package com.example.arena.domain.group.dto.response;

import com.example.arena.domain.group.entity.GroupType;
import com.example.arena.domain.member.dto.response.MemberResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.A;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GroupResponse {
    private UUID groupId;
    private String groupName;
    private String information;
    private String language;
    private Integer maxNum;
    private Integer curNum;
    private GroupType groupType;
    private MemberResponse leader;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
