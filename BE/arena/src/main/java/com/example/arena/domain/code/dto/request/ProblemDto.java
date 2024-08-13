package com.example.arena.domain.code.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProblemDto {
	private String roomId;
	private String description;
	private String inputCondition;
	private String outputCondition;
	private TestCase[] examples;
}
