package com.example.arena.domain.group.dto.request;

import com.example.arena.domain.group.entity.GroupType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MakeGroupRequest {
    private String groupName;
    private GroupType groupType;
    private Integer maxNum;
}
