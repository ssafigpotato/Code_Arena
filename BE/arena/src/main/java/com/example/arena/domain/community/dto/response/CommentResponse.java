package com.example.arena.domain.community.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
	private UUID commentId;
	private UUID memberId;
	private UUID boardId;
	private String content;
	private int likes;
	private boolean isSecret;
}
