package com.example.arena.domain.community.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
	// memberId 담아야함
	private UUID id;
	private String content;
	private int likes;
	private boolean isSecret;
	private String nickname;
	private LocalDateTime createdAt;
}
