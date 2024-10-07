package com.example.arena.global.error;

import org.springframework.http.HttpStatus;

public enum ErrorType {


    // 4xx
    USER_INVALID_JWT(10001, HttpStatus.UNAUTHORIZED),
    USER_JWT_EXPIRED(10002, HttpStatus.UNAUTHORIZED),
    USER_UNAUTHENTICATED(10003, HttpStatus.UNAUTHORIZED),
    USER_NOT_FOUND(10004, HttpStatus.NOT_FOUND)

    ;

    public int code;
    public HttpStatus httpStatus;

    ErrorType(int code, HttpStatus httpStatus) {
        this.code = code;
        this.httpStatus = httpStatus;
    }

}
