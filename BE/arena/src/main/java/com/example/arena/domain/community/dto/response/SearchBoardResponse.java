package com.example.arena.domain.community.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.arena.domain.community.entity.BoardType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Response : 제목 / 닉네임 / 작성일 / 추천 / 댓글 수
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SearchBoardResponse {
	private UUID boardId;
	private String title;
	private String nickname;
	private long comments;
	private int likes;
	private int views;
	private String content;
	private String writerImage;
	private LocalDateTime createdAt;
	private BoardType boardType;
}
