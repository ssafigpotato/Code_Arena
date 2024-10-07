package com.example.arena.domain.community.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.community.entity.Board;
import com.example.arena.domain.community.entity.BoardType;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID> {
	@Query("SELECT b FROM Board b " + "JOIN Member m ON b.member.id = m.id " + "WHERE b.title LIKE %:keyword% "
			+ "OR b.content LIKE %:keyword% " + "OR m.nickname LIKE %:keyword% " + "ORDER BY b.createdAt DESC")
	List<Board> findWHOLEByKeyword(@Param("keyword") String keyword);

	List<Board> findByTitleContainingOrderByCreatedAtDesc(String keyword);

	List<Board> findByContentContainingOrderByCreatedAtDesc(String keyword);

	@Query("SELECT b FROM Board b where b.title Like %:keyword% OR b.content LIKE %:keyword% ORDER BY b.createdAt DESC")
	List<Board> findBOTHByKeyword(@Param("keyword") String keyword);

	List<Board> findByMemberId(UUID id);

	List<Board> findByBoardTypeOrderByCreatedAtDesc(BoardType boardType);

	// 소프트 딜리트 구현
	List<Board> findByDeletedAtIsNull();
}
