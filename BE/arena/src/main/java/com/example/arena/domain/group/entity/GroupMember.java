package com.example.arena.domain.group.entity;

import com.example.arena.domain.member.entity.Member;
import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupMember {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id = UlidCreator.getMonotonicUlid().toUuid();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private Integer meetingTime;

    @Enumerated(EnumType.STRING)
    private GroupInviteCode inviteCode;

    @Enumerated(EnumType.STRING)
    private GroupMemberType memberType;

    public GroupMember(Group group, Member member, GroupMemberType memberType) {
        this.group = group;
        this.member = member;
        this.meetingTime = 0;
        this.inviteCode = GroupInviteCode.REQUEST;
        this.memberType = memberType;
    }

    public void changeMemberType(GroupMemberType memberType) {
        this.memberType = memberType;
    }

    public GroupMember(Group group, Member member, GroupInviteCode inviteCode, GroupMemberType memberType) {
        this.group = group;
        this.member = member;
        this.inviteCode = inviteCode;
        this.memberType = memberType;
    }

    public void acceptInvite() {
        this.inviteCode = GroupInviteCode.ACCEPT;
    }

    public void applyInvite() {
        this.inviteCode = GroupInviteCode.APPLY;
    }

    public void expireInvite() {
        this.inviteCode = GroupInviteCode.EXPIRED;
    }

    public void plusTime(Integer time) {
        this.meetingTime += time;
    }

}
