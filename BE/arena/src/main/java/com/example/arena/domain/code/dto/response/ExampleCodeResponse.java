package com.example.arena.domain.code.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExampleCodeResponse {
	private int index;
	private boolean isCorrect;
	private long executionTime;
	private String output;
}
