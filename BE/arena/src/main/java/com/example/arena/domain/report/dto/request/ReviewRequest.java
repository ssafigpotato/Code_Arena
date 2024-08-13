package com.example.arena.domain.report.dto.request;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
	private UUID roomId;
	private UUID memberId;
	private int score;
	private String title;
	private String content;
}
