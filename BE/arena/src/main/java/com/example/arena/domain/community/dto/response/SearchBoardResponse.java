package com.example.arena.domain.community.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Response : 제목 / 닉네임 / 작성일 / 추천 / 댓글 수
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SearchBoardResponse {
	private String title;
	private String nickname;
//	private Date createdAt; 구현 필요
	private long comments;
	private int likes;
}
