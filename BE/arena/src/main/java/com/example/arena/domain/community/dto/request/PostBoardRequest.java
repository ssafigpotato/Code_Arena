package com.example.arena.domain.community.dto.request;

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
	private String type;
}
