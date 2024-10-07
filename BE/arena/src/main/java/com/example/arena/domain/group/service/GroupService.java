package com.example.arena.domain.group.service;

import com.example.arena.domain.group.dto.request.*;
import com.example.arena.domain.group.dto.response.GroupDetailResponse;
import com.example.arena.domain.group.dto.response.GroupMemberResponse;
import com.example.arena.domain.group.dto.response.GroupResponse;
import com.example.arena.domain.group.entity.Group;
import com.example.arena.domain.group.entity.GroupInviteCode;
import com.example.arena.domain.group.entity.GroupMember;
import com.example.arena.domain.group.entity.GroupMemberType;
import com.example.arena.domain.group.mapper.GroupMapper;
import com.example.arena.domain.group.repository.GroupMemberRepository;
import com.example.arena.domain.group.repository.GroupRepository;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.service.MemberService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupService {
    private final MemberService memberService;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupMapper groupMapper;

    public GroupService(MemberService memberService, GroupRepository groupRepository, GroupMemberRepository groupMemberRepository, GroupMapper groupMapper) {
        this.memberService = memberService;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.groupMapper = groupMapper;
    }

    public GroupResponse makeGroup(MakeGroupRequest request) {
        Member member = memberService.getMemberValue();
        Group group = groupRepository.save(groupMapper.makeRequestToEntity(request,member));

        return groupMapper.entityToResponse(group);
    }

    public GroupDetailResponse getGroup(UUID id) {
        Group group = groupRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        return groupMapper.entityToDetailResponse(group);
    }

    public List<GroupDetailResponse> getMyGroups() {
        return groupMapper.groupsToDetailResponse(memberService.getMemberValue().getGroups());
    }

    @Transactional
    public void deleteGroup(UUID id) {
        Group group = getGroupById(id);
        group.softDelete();
    }

    @Transactional
    public GroupResponse updateGroup(UpdateGroupRequest request) {
        Group group = groupRepository.findById(request.getGroupId()).orElseThrow(EntityNotFoundException::new);
        group.update(request.getInformation(),request.getLanguage());
        return groupMapper.entityToResponse(group);
    }

    private Group getGroupById(UUID id) {
        return groupRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    @Transactional
    public GroupDetailResponse changeLeader(ChangeLeaderRequest request) {
        Group group = getGroupById(request.getGroupId());
        Member newLeader = memberService.searchMemberById(request.getLeaderId());
        Member pastLeader = group.getLeader();

        for(GroupMember groupMember : group.getMembers()) {
            if(groupMember.getMember().getId().equals(newLeader.getId())) {
                group.changeLeader(newLeader);
                groupMember.changeMemberType(GroupMemberType.LEADER);
            }

            if(groupMember.getMember().getId().equals(pastLeader.getId())) {
                groupMember.changeMemberType(GroupMemberType.FOLLOWER);
            }
        }

        return groupMapper.entityToDetailResponse(group);
    }

    public List<GroupMemberResponse> getCurInviteInformation(UUID groupId) {
        return getGroupById(groupId).getMembers().stream().map(groupMapper::toGroupMemberResponse).toList();
    }

    @Transactional
    public GroupMemberResponse inviteGroup(GroupInviteRequest request) {
        Group group = getGroupById(request.getGroupId());
        Member member = memberService.searchMemberById(request.getUserId());

        GroupMember groupMember = new GroupMember(group,member, GroupMemberType.FOLLOWER);
        group.addGroupMember(groupMember);

        return groupMapper.toGroupMemberResponse(groupMember);
    }

    @Transactional
    public GroupMemberResponse applyInvite(GroupAcceptRequest request) {
        Member member = memberService.getMemberValue();
        Group group = getGroupById(request.getGroupId());

        if(!group.hasMember(member))
            return new GroupMemberResponse(group.getId(), member.getId(), member.getEmail(), member.getName(), GroupInviteCode.WRONG);

        GroupMember groupMember = group.getGroupMember(member);
        groupMember.applyInvite();

        return groupMapper.toGroupMemberResponse(groupMember);
    }

    @Transactional
    public List<GroupResponse> getAllGroups() {
        List<Group> groups = groupRepository.findAllWithLeader();
        return groups.stream().map(x -> groupMapper.entityToResponse(x)).collect(Collectors.toList());
    }

    @Transactional
    public GroupDetailResponse applyGroup(ApplyGroupRequest request) {
        Group group = getGroupById(request.getGroupId());
        Member member = memberService.searchMemberById(request.getMemberId());
        GroupMember groupMember = new GroupMember(group,member, GroupInviteCode.APPLY, GroupMemberType.FOLLOWER);
        group.addGroupMember(groupMember);

        return groupMapper.entityToDetailResponse(group);
    }

    @Transactional
    public GroupDetailResponse acceptGroup(AcceptGroupRequest request) {
        Group group = getGroupById(request.getGroupId());
        Member member = memberService.searchMemberById(request.getMemberId());
        GroupMember groupMember = findGroupMember(group,member);
        groupMember.acceptInvite();

        return groupMapper.entityToDetailResponse(group);
    }

    public GroupMember findGroupMember(Group group, Member member) {
        return group.getMembers().stream().filter(x -> x.getMember().getId().equals(member.getId())).findFirst().orElseThrow(EntityNotFoundException::new);
    }

    @Transactional
    public GroupDetailResponse withDrawGroup(WithDrawGroupRequest request) {
        Group group = getGroupById(request.getGroupId());
        Member member = memberService.searchMemberById(request.getMemberId());
        GroupMember groupMember = findGroupMember(group,member);
        group.getMembers().remove(groupMember);

        return groupMapper.entityToDetailResponse(group);
    }

}
