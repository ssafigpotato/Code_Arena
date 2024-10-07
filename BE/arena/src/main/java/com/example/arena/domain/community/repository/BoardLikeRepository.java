package com.example.arena.domain.community.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.community.entity.BoardLike;

@Repository
public interface BoardLikeRepository extends JpaRepository<BoardLike, UUID> {
	Optional<BoardLike> findByMemberIdAndBoardId(UUID memberId, UUID boardId);

	// 좋아요를 소프트 딜리트로 구현하면 굉장히 좋은 경험이 될 것 같습니다.

}
