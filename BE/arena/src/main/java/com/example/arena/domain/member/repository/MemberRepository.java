package com.example.arena.domain.member.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.arena.domain.member.entity.Member;

public interface MemberRepository extends JpaRepository<Member, UUID> {
	@Query("SELECT m.nickName FROM Member m WHERE m.id = :memberId")
	String findNickNameByMemberId(@Param("memberId") UUID memberId);
}
