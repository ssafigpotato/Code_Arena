package com.example.arena.global.exception;

public class UserNotFoundException extends RuntimeException {
	private static final String CUSTOM_ERR_CODE = "USER_NOT_FOUND";
	private static final String MESSAGE = "해당 유저가 존재하지 않습니다.";

	public UserNotFoundException() {
		super(MESSAGE);
	}

	public UserNotFoundException(String message) {
		super(message);
	}
	
	
}
