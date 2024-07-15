package com.example.arena.domain.community.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.arena.domain.community.entity.CommentLike;

public interface CommentLikeRepository extends JpaRepository<CommentLike, UUID> {

	Optional<CommentLike> findByMemberIdAndBoardId(UUID memberId, UUID boardId);

}
