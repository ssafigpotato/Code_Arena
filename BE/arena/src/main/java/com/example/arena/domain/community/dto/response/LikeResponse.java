package com.example.arena.domain.community.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LikeResponse {
	private UUID boardId;
	private UUID memberId;
	private int likes;

	public LikeResponse(int likes) {
		this.likes = likes;
	}
}
