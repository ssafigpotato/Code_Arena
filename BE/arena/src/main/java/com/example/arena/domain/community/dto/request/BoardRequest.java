package com.example.arena.domain.community.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardRequest {
	private int memberId;
	private String title;
	private String content;
	private String type;
}
