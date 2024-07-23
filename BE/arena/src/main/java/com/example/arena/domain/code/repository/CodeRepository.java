package com.example.arena.domain.code.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.code.entity.Code;
import com.example.arena.domain.member.entity.Member;

@Repository
public interface CodeRepository extends JpaRepository<Code, UUID> {

	List<Code> findByMember(Member curMember);

}
