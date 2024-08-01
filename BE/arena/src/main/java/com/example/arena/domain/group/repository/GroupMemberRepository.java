package com.example.arena.domain.group.repository;

import com.example.arena.domain.group.entity.Group;
import com.example.arena.domain.group.entity.GroupMember;
import com.example.arena.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    Optional<GroupMember> findByGroupAndMember(Group group, Member member);
}
