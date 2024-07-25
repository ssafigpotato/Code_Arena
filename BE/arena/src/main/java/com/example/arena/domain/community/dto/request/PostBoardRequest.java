package com.example.arena.domain.community.dto.request;

import com.example.arena.domain.community.entity.BoardType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class PostBoardRequest {
	private String title;
	private String content;
	private BoardType type;
}
