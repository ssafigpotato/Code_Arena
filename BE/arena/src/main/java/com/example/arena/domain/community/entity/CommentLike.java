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
public class CommentLike {
	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id = UlidCreator.getMonotonicUlid().toUuid();
	private UUID commentId;
	private UUID memberId;
	private UUID boardId;
	@Column(columnDefinition = "boolean default true") // default 생성시 true
	private boolean isLiked;

	public boolean isLiked() {
		return isLiked;
	}

	public void update(boolean b) {
		isLiked = b;
	}

	public CommentLike(UUID commentId, UUID boardId, UUID memberId, boolean isLiked) {
		this.commentId = commentId;
		this.boardId = boardId;
		this.memberId = memberId;
		this.isLiked = isLiked;
	}
}
