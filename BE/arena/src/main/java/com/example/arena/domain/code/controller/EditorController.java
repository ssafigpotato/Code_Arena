package com.example.arena.domain.code.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.arena.domain.code.dto.request.CodeRequest;
import com.example.arena.domain.code.dto.response.ExampleCodeResponse;
import com.example.arena.domain.code.dto.response.ExecuteCodeResponse;
import com.example.arena.domain.code.service.CodeService;

@RestController
@RequestMapping("/api/v1/editor")
public class EditorController {

	@Autowired
	private CodeService codeService;

//	@PostMapping("/execute")
//	public ResponseEntity<String> executeCode(@RequestBody ExecuteCodeRequest request) {
//		return ResponseEntity.ok(codeService.executeCode(request));
//	}

	// 테스트 케이스 빌드
	// TODO : JSON 형태로 Redis에 저장된 문제 input과 output을 받을 것으로 예상 -> json 처리 필요
	@PostMapping("/build/{roomId}")
	public ResponseEntity<List<ExecuteCodeResponse>> executeCodeWithInput(@PathVariable(name = "roomId") UUID roomId,
			@RequestBody CodeRequest request) {
		return ResponseEntity.ok(codeService.executeCodeWithInput(roomId, request));
	}

	@PostMapping("/example/{roomId}")
	public ResponseEntity<List<ExampleCodeResponse>> executeCodeWithExamples(@PathVariable(name = "roomId") UUID roomId,
			@RequestBody CodeRequest request) {
		return ResponseEntity.ok(codeService.executeCodeWithExample(roomId, request));
	}

}
