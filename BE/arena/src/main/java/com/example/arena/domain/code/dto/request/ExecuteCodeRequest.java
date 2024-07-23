package com.example.arena.domain.code.dto.request;

import com.example.arena.domain.code.entity.Language;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExecuteCodeRequest {
	private String content;
	private Language language;
}
