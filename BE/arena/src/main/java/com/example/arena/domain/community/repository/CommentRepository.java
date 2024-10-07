package com.example.arena.domain.community.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.community.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
	@Query("SELECT COUNT(c) FROM Comment c WHERE c.board.id = :boardId")
	long countByBoardId(@Param("boardId") UUID boardId);

	List<Comment> findByBoardIdOrderByCreatedAtAsc(UUID boardId);

}
