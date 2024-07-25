package com.example.arena.global.exception;

public class InvalidJwtTokenException extends RuntimeException {
	private static final String MESSAGE = "유효하지 않은 토큰입니다.";

	public InvalidJwtTokenException() {
		super(MESSAGE);
	}

	public InvalidJwtTokenException(String message) {
		super(message);
	}
	
	
}
