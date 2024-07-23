package com.example.arena.domain.community.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
	private String content;
	private int likes;
	private boolean isSecret;
	private String nickname;
}
