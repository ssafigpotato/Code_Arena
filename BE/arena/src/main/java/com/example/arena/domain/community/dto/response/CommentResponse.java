package com.example.arena.domain.community.dto.response;

import java.util.UUID;

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
}
