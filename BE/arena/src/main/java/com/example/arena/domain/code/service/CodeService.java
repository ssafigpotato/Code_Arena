package com.example.arena.domain.code.service;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.arena.domain.code.dto.request.CodeRequest;
import com.example.arena.domain.code.dto.request.ExampleRequest;
import com.example.arena.domain.code.dto.request.PostCodeRequest;
import com.example.arena.domain.code.dto.request.TestCase;
import com.example.arena.domain.code.dto.request.TestCaseRequest;
import com.example.arena.domain.code.dto.response.CodeResponse;
import com.example.arena.domain.code.dto.response.ExampleCodeResponse;
import com.example.arena.domain.code.dto.response.ExecuteCodeResponse;
import com.example.arena.domain.code.entity.Code;
import com.example.arena.domain.code.entity.Language;
import com.example.arena.domain.code.executor.CPPCodeExecutor;
import com.example.arena.domain.code.executor.CodeExecutor;
import com.example.arena.domain.code.executor.JAVACodeExecutor;
import com.example.arena.domain.code.executor.PYTHONCodeExecutor;
import com.example.arena.domain.code.mapper.CodeMapper;
import com.example.arena.domain.code.repository.CodeRepository;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.room.entity.Room;
import com.example.arena.domain.room.repository.RoomRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CodeService {
//	@Autowired
//	private MemberService memberService;

	@Autowired
	private CodeRepository codeRepository;

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	private CodeMapper codeMapper;

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	private final String TEST_CASE_KEY = "testcases:";

	private final String EXAMPLE_KEY = "examples:";

	private final String TEST_CASE_CHECK_KEY = "testcasecheck:"; // testcase 얼마나 맞았는지

	private final String CODE_KEY = "code:";

//	private static final String INPUT_KEY_PREFIX = "code:input:";

	// java python cpp만 code executor 사용 가능
	public CodeService() {
		executors.put(Language.JAVA, new JAVACodeExecutor());
		executors.put(Language.PYTHON, new PYTHONCodeExecutor());
		executors.put(Language.CPP, new CPPCodeExecutor());
	}

	// HashMap -> EnumMap 메모리 효율 증가
	private final Map<Language, CodeExecutor> executors = new EnumMap<>(Language.class);

//	public List<CodeResponse> getCode() {
//		Member curMember = memberService.getMemberValue();
//		List<Code> codes = codeRepository.findByMember(curMember);
//		return codes.stream().map(codeMapper::entityToResponse).toList();
//	}

	public void deleteCode(UUID codeId) {
		codeRepository.deleteById(codeId);
	}

	@Transactional
	public void createCode(PostCodeRequest request) {
		redisTemplate.opsForValue().set(CODE_KEY + request.getRoomId(), request.getContent());
		System.out.println("코드는 : " + (String) redisTemplate.opsForValue().get(CODE_KEY + request.getRoomId().toString()));
	}

//	public CodeResponse getCodeDetail(UUID codeId) {
//		Code code = codeRepository.findById(codeId).orElseThrow(ResourceNotFoundException::new);
//		return codeMapper.entityToResponse(code);
//	}

	/**
	 * input txt를 언어별로 실행 하는 메서드
	 * 
	 * @param roomId
	 * @param request
	 * @return
	 */
	public List<ExecuteCodeResponse> executeCodeWithInput(UUID roomId, CodeRequest request) {
		TestCaseRequest testCaseRequest = getTestCases(roomId);
		TestCase[] testCases = testCaseRequest.getTestcases();
		List<ExecuteCodeResponse> responses = new ArrayList<>();
		CodeExecutor executor = executors.get(request.getLanguage());
		int count = 0;// 테케 얼마나 맞았는지
		for (int i = 0; i < 10; i++) {
			TestCase testCase = testCases[i];
			responses.add(executeWithInput(executor, request, testCase, i));
			if (responses.get(i).isCorrect())
				count++;
		}
		redisTemplate.opsForValue().set(TEST_CASE_CHECK_KEY + roomId.toString(), count); // 마지막 테케 제출 얼마나 맞았는지저장
		return responses;
	}

	public List<ExampleCodeResponse> executeCodeWithExample(UUID roomId, CodeRequest request) {
		ExampleRequest exampleRequest = getExamples(roomId);
		TestCase[] examples = exampleRequest.getTestCases();
		List<ExampleCodeResponse> responses = new ArrayList<>();
		CodeExecutor executor = executors.get(request.getLanguage());
		for (int i = 0; i < 3; i++) {
			TestCase testCase = examples[i];
			responses.add(executeExamplesWithInput(executor, request, testCase, i));
		}
		return responses;
	}

	private ExampleCodeResponse executeExamplesWithInput(CodeExecutor executor, CodeRequest request, TestCase testCase,
			int index) {
		// i번째 테스트케이스에 대한 input output 처리
		String input = testCase.getIn();
		String output = testCase.getOut();
		try {
			CodeResponse userCodeResponse = executor.execute(input, request);
			return codeMapper.codeResponseToExampleCodeResponse(index, userCodeResponse.getOutput().equals(output),
					userCodeResponse.getExecutionTime(), userCodeResponse.getOutput());
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	private ExecuteCodeResponse executeWithInput(CodeExecutor executor, CodeRequest request, TestCase testCase,
			int index) {
		// i번째 테스트케이스에 대한 input output 처리
		String input = testCase.getIn();
		String output = testCase.getOut();
		try {
			CodeResponse userCodeResponse = executor.execute(input, request);
			return codeMapper.codeResponseToExecuteCodeResponse(index, userCodeResponse.getOutput().equals(output),
					userCodeResponse.getExecutionTime());
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

//	public CodeResponse execute(CodeRequest request) throws Exception {
//		CodeExecutor executor = executors.get(request.getLanguage());
//		if (executor == null) {
//			throw new UnsupportedOperationException("Unsupported language: " + request.getLanguage());
//		}
//		return executor.execute(request);
//	}

	public void saveTestCases(TestCaseRequest testCaseRequest) {
		try {
			String json = objectMapper.writeValueAsString(testCaseRequest);
			redisTemplate.opsForValue().set(TEST_CASE_KEY + testCaseRequest.getRoomId(), json);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to convert to JSON", e);
		}
	}

	public TestCaseRequest getTestCases(UUID roomId) {
		String json = (String) redisTemplate.opsForValue().get(TEST_CASE_KEY + roomId.toString());

		if (json == null) {
			return null;
		}

		try {
			return objectMapper.readValue(json, TestCaseRequest.class);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to parse JSON", e);
		}
	}

	public void saveExamples(ExampleRequest exampleRequest) {
		try {
			String json = objectMapper.writeValueAsString(exampleRequest);
			redisTemplate.opsForValue().set(EXAMPLE_KEY + exampleRequest.getRoomId(), json);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to convert to JSON", e);
		}
	}

	public ExampleRequest getExamples(UUID roomId) {
		String json = (String) redisTemplate.opsForValue().get(EXAMPLE_KEY + roomId.toString());
		if (json == null) {
			return null;
		}
		try {
			return objectMapper.readValue(json, ExampleRequest.class);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to parse JSON", e);
		}
	}

}
