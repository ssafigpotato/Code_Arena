package com.example.arena.domain.code.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ExecuteCodeResponse {
	private int index; // 테케 번호
	private boolean isCorrect; // 실제 output과 예쌍 output이 같은지
	private long executionTime; // ms 단위
}
