package com.example.arena.domain.code.dto.request;

import com.example.arena.domain.code.dto.response.ExampleCodeResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ExampleTerminalDto {
	private String roomId;
	private ExampleCodeResponse[] responses;
}
