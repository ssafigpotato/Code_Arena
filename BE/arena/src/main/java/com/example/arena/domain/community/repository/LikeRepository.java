package com.example.arena.domain.community.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.community.entity.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, UUID>{

	Optional<Like> findByMemberAndBoard(UUID memberId, UUID boardId);

}
