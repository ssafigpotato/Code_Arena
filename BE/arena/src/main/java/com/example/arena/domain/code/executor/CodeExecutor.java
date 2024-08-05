package com.example.arena.domain.code.executor;

import com.example.arena.domain.code.dto.request.CodeRequest;
import com.example.arena.domain.code.dto.response.CodeResponse;

public interface CodeExecutor {
	CodeResponse execute(CodeRequest request) throws Exception;
}
