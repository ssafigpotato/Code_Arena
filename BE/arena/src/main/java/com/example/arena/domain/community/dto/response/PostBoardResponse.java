package com.example.arena.domain.community.dto.response;

import java.util.UUID;

import com.example.arena.domain.community.entity.BoardType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostBoardResponse {
	private UUID boardId;
	private String title;
	private String content;
	private BoardType type;
}
