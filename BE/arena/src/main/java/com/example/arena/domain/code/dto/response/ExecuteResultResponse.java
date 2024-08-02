package com.example.arena.domain.code.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExecuteResultResponse {
    private ExecuteResult[] results;
}

@Getter
@NoArgsConstructor
@AllArgsConstructor
class ExecuteResult {
    private int id;
    private boolean result;
}




