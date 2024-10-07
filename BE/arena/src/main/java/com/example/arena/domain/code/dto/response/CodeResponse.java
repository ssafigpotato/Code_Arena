package com.example.arena.domain.code.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
// TODO : 제출하기를 하면 최종 제출만 DB에 저장, 그리고 제출 횟수를 저장해야되기때문에
// code 테이블에 제출 횟수 저장 해야될 듯.
public class CodeResponse {
	private boolean isDone;
	private long executionTime;
	private String output; // output 으로 잠시 대체 -> 원래는 tesetcasenum
}
/*
 * boolean 성공여부 int 실행시간 int 테케번호 -> code 엔터티에 제출 횟수 저장 필요하고,
 */