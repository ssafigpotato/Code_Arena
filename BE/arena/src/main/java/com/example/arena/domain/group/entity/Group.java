package com.example.arena.domain.group.entity;

import com.example.arena.domain.member.entity.Member;
import com.example.arena.global.entity.BaseEntity;
import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Where;

import java.util.*;

@Entity
@Getter
@Table(name = "`Group`")
@SQLRestriction("deleted_at is null")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Group extends BaseEntity {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id = UlidCreator.getMonotonicUlid().toUuid();

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id")
    private Member leader;

    @Enumerated(EnumType.STRING)
    private GroupType type;

    private String information;

    private String language;

    @OneToMany(
            mappedBy = "group",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
            orphanRemoval = true
    )
    private Set<GroupMember> members = new HashSet<>();

    private Integer maxNum;

    public Group(String name, Member leader, GroupType type, Integer maxNum, String information, String language) {
        this.name = name;
        this.leader = leader;
        this.type = type;
        this.maxNum = maxNum;
        this.information = information;
        this.language = language;

        final GroupMember groupMember = new GroupMember(
            this, leader, GroupMemberType.LEADER
        );

        this.members.add(groupMember);
        groupMember.acceptInvite();
    }

    public void addGroupMember(GroupMember groupMember) {
        if(hasMember(groupMember.getMember()))
            return;

        this.members.add(groupMember);
    }

    public void changeLeader(Member newLeader) {
        this.leader = newLeader;
    }

    public boolean hasMember(Member member) {
        return this.members.stream().anyMatch(x -> x.getId().equals(member.getId()));
    }

    public GroupMember getGroupMember(Member member) {
        return this.members.stream().filter(x -> x.getId().equals(member.getId())).findFirst().orElseThrow(
                EntityNotFoundException::new
        );
    }


    public void update(String information,String language) {
        this.information = information;
        this.language = language;
    }
}
