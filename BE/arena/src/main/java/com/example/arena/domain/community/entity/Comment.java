package com.example.arena.domain.community.entity;

import java.util.UUID;

import org.hibernate.annotations.SQLRestriction;

import com.example.arena.global.entity.BaseEntity;
import com.github.f4b6a3.ulid.UlidCreator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted_at is null")
public class Comment extends BaseEntity {
	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id = UlidCreator.getMonotonicUlid().toUuid();
	private UUID memberId;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "board_id", nullable = false)
	private Board board;
	private String content;
	@Column(columnDefinition = "int default 0")
	private int likes;
	private boolean isSecret;

	public Comment(UUID memberId, Board board, String content, boolean isSecret) {
		this.memberId = memberId;
		this.board = board;
		this.content = content;
		this.isSecret = isSecret;
	}

	public void update(String content, boolean isSecret) {
		this.content = content;
		this.isSecret = isSecret;
	}

	public void update(int likes) {
		this.likes = likes;
	}
}
