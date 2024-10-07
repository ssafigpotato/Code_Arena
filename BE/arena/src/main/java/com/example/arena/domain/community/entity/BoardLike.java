package com.example.arena.domain.community.entity;

import java.util.UUID;

import com.github.f4b6a3.ulid.UlidCreator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BoardLike {
	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id = UlidCreator.getMonotonicUlid().toUuid();
	private UUID memberId;
	private UUID boardId;
	private boolean isLiked;

	public BoardLike(UUID boardId, UUID memberId, boolean isLiked) {
		this.boardId = boardId;
		this.memberId = memberId;
		this.isLiked = isLiked;
	}

	public void update(boolean isLiked) {
		this.isLiked = isLiked;
	}

}
