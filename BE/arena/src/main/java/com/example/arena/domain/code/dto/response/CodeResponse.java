package com.example.arena.domain.code.dto.response;

import com.example.arena.domain.code.entity.Language;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CodeResponse {
	// room 이름
	// 맴버이름
	private String problem;
	private Language language;
	private String content;
}
