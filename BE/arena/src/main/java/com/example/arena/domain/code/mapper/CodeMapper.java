package com.example.arena.domain.code.mapper;

import org.springframework.stereotype.Component;

import com.example.arena.domain.code.dto.request.PostCodeRequest;
import com.example.arena.domain.code.dto.response.ExampleCodeResponse;
import com.example.arena.domain.code.dto.response.ExecuteCodeResponse;
import com.example.arena.domain.code.entity.Code;

@Component
public class CodeMapper {

//	public CodeResponse entityToResponse(Code code) {
//		return new CodeResponse(code.getProblem(), code.getLanguage(), code.getContent());
//	}

	public ExecuteCodeResponse codeResponseToExecuteCodeResponse(int index, boolean isCorrect, long executionTime) {
		return new ExecuteCodeResponse(index, isCorrect, executionTime);
	}

	public ExampleCodeResponse codeResponseToExampleCodeResponse(int index, boolean isCorrect, long executionTime,
			String output) {
		return new ExampleCodeResponse(index, isCorrect, executionTime, output);
	}

}
