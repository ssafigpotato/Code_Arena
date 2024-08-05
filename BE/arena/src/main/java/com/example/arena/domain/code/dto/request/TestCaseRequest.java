package com.example.arena.domain.code.dto.request;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseRequest {
	private UUID roomId;
	private TestCase[] testcases;
}
