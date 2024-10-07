package com.example.arena.domain.code.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.arena.domain.code.dto.request.ExampleRequest;
import com.example.arena.domain.code.dto.request.PostCodeRequest;
import com.example.arena.domain.code.dto.request.ProblemDto;
import com.example.arena.domain.code.dto.request.TestCaseRequest;
import com.example.arena.domain.code.service.CodeService;
import com.example.arena.domain.code.service.ProblemService;

@RestController
@RequestMapping("/api/v1/code")
public class CodeController {
	@Autowired
	private CodeService codeService;

	@Autowired
	private ProblemService problemService;

//	@GetMapping("")
//	public ResponseEntity<List<CodeResponse>> getCode() {
//		return ResponseEntity.ok(codeService.getCode());
//	}
//	
//	@GetMapping("/{codeId}")
//	public ResponseEntity<CodeResponse> getCodeDetail(@PathVariable (name="codeId") UUID codeId){
//		return ResponseEntity.ok(codeService.getCodeDetail(codeId));
//	}
//
//	@DeleteMapping("/{codeId}")
//	public ResponseEntity<Void> deleteCode(@PathVariable(name = "codeId") UUID codeId) {
//		codeService.deleteCode(codeId);
//		return ResponseEntity.noContent().build();
//	}
//
	@PostMapping("")
	public ResponseEntity<Void> createCode(@RequestBody PostCodeRequest request) {
		codeService.createCode(request);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/testcases")
	public ResponseEntity<Void> saveTestCases(@RequestBody TestCaseRequest testCaseRequest) {
		codeService.saveTestCases(testCaseRequest);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/testcases/{roomId}")
	public TestCaseRequest getTestCases(@PathVariable(name = "roomId") UUID roomId) {
		return codeService.getTestCases(roomId);
	}

	@PostMapping("/examples")
	public ResponseEntity<Void> saveExamples(@RequestBody ExampleRequest exampleRequest) {
		codeService.saveExamples(exampleRequest);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/examples/{roomId}")
	public ExampleRequest getExamples(@PathVariable(name = "roomId") UUID roomId) {
		return codeService.getExamples(roomId);
	}

	@PostMapping("/problem")
	public ResponseEntity<Void> saveProblem(@RequestBody ProblemDto problem) {
		problemService.saveProblem(problem);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/problem/{roomId}")
	public ProblemDto getProblem(@PathVariable(name = "roomId") UUID roomId) {
		return problemService.getProblem(roomId);
	}
}
