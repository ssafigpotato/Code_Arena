package com.example.arena.domain.code.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseRequest {
	private String roomId;
	private TestCase[] testcases;
}
