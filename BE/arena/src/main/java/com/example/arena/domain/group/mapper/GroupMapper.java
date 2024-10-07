package com.example.arena.domain.group.mapper;

import com.example.arena.domain.group.dto.request.MakeGroupRequest;
import com.example.arena.domain.group.dto.response.GroupDetailResponse;
import com.example.arena.domain.group.dto.response.GroupMemberDetailResponse;
import com.example.arena.domain.group.dto.response.GroupMemberResponse;
import com.example.arena.domain.group.dto.response.GroupResponse;
import com.example.arena.domain.group.entity.Group;
import com.example.arena.domain.group.entity.GroupInviteCode;
import com.example.arena.domain.group.entity.GroupMember;
import com.example.arena.domain.member.dto.response.MemberResponse;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.mapper.MemberMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class GroupMapper {

    private final MemberMapper memberMapper;

    public GroupMapper(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }

    public Group makeRequestToEntity(MakeGroupRequest request, Member leader) {
        return new Group(
                request.getGroupName(),
                leader,
                request.getGroupType(),
                request.getMaxNum(),
                request.getInformation(),
                request.getLanguage()
        );
    }

    public GroupResponse entityToResponse(Group group) {
        return new GroupResponse(
                group.getId(),
                group.getName(),
                group.getInformation(),
                group.getLanguage(),
                group.getMaxNum(),
                count(group),
                group.getType(),
                memberMapper.entityToDto(group.getLeader()),
                group.getCreatedAt(),
                group.getUpdatedAt()
        );
    }

    public Integer count(Group group) {
        Integer count = 0;

        for(GroupMember groupMember : group.getMembers()) {
            if(groupMember.getInviteCode().equals(GroupInviteCode.ACCEPT)) {
                count++;
            }
        }

        return count;
    }

    public GroupDetailResponse entityToDetailResponse(Group group) {
        return new GroupDetailResponse(
                entityToResponse(group),entityToMembers(group)
        );
    }

    public List<GroupDetailResponse> groupsToDetailResponse(Set<GroupMember> groups) {
        return groups.stream().map(
                x -> new GroupDetailResponse(
                        entityToResponse(x.getGroup()),entityToMembers(x.getGroup())
                )
        ).toList();
    }

    public MemberResponse entityToMemberResponse(GroupMember groupMember) {
        Member curMember = groupMember.getMember();
        return memberMapper.entityToDto(curMember);
    }

    public List<GroupMemberDetailResponse> entityToMembers(Group group) {
       return group.getMembers().stream()
               .map(this::toGroupMemberDetailResponse)
               .collect(Collectors.toList());
    }

    public GroupMemberDetailResponse toGroupMemberDetailResponse(GroupMember groupMember) {
        return new GroupMemberDetailResponse(
                groupMember.getGroup().getId(),
                groupMember.getMeetingTime(),
                groupMember.getInviteCode(),
                groupMember.getMemberType(),
                memberMapper.entityToDto(groupMember.getMember())
        );
    }

    public GroupMemberResponse toGroupMemberResponse(GroupMember groupMember) {
        return new GroupMemberResponse(
                groupMember.getGroup().getId(),
                groupMember.getMember().getId(),
                groupMember.getMember().getEmail(),
                groupMember.getMember().getName(),
                groupMember.getInviteCode()
        );
    }

}
