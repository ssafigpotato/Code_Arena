package com.example.arena.domain.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Interviewee {
	private String nickname;
	private String name;
	private String image;
	private int score;
	private String title;
	private String content;
}
