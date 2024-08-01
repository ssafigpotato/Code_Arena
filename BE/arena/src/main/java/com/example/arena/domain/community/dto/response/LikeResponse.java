package com.example.arena.domain.community.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
// 필요한 게 : 좋아요를 했는지 안했는지 
public class LikeResponse {
	private UUID boardId;
	private UUID memberId;
	private int likes;

	public LikeResponse(int likes) {
		this.likes = likes;
	}
}
