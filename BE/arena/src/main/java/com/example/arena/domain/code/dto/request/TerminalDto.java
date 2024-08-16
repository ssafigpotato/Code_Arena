package com.example.arena.domain.code.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TerminalDto<T> {
	private String roomId;
	private T[] responses;
}
