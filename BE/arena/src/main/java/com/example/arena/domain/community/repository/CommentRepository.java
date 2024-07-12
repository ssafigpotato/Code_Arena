package com.example.arena.domain.community.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.community.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
	List<Comment> findByBoardId(UUID boardId);

}
