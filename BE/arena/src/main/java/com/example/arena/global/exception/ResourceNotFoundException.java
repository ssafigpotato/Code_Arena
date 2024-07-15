package com.example.arena.global.exception;

public class ResourceNotFoundException extends RuntimeException {
	private static final String MESSAGE = "해당 데이터가 존재하지 않습니다.";

	public ResourceNotFoundException() {
		super(MESSAGE);
	}
	
	public ResourceNotFoundException(String message) {
		super(message);
	}
	
	
}
