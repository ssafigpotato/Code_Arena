package com.example.arena.global.error;

import lombok.Data;

@Data
public class ErrorResponse {

    private ErrorInfo error;

    public ErrorResponse(int code, String message) {
        this.error = new ErrorInfo(code, message);
    }

}

@Data
class ErrorInfo {
    int code;
    String message;

    ErrorInfo(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
