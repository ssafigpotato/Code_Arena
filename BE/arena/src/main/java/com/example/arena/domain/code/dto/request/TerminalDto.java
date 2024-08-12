package com.example.arena.domain.code.dto.request;

import com.example.arena.domain.code.dto.response.ExecuteCodeResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TerminalDto {
	private String roomId;
	private ExecuteCodeResponse[] responses;
}
