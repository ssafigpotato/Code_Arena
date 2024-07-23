package com.example.arena.domain.community.dto.request;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBoardRequest {
	private UUID boardId;
	private String title;
	private String content;
}
