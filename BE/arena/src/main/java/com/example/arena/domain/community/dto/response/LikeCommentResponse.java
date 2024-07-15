package com.example.arena.domain.community.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LikeCommentResponse {
	private UUID commentId;
	private UUID memberId;
	private UUID boardId;
	private int likes;

	public LikeCommentResponse(int likes) {
		this.likes = likes;
	}

}
