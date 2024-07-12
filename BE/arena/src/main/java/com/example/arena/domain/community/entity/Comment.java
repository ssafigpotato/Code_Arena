package com.example.arena.domain.community.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Comment {
	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id;
	private UUID memberId;
	private UUID boardId;
	private String content;
	@Column(columnDefinition = "int default 0")
	private int likes;
	private boolean isSecret;
}
